import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import update from 'react/lib/update';

import BlockDumbComp from 'components/BlockDumbComp';
import Bullet from 'components/Bullet';
import ResumeHeader from 'components/ResumeHeader';
import ResumeFooter from 'components/ResumeFooter';
import ResumeSavePrint from 'components/ResumeSavePrint';
import { moveBlock,
         dropBullet,
         moveBullet,
         updateResumeState,
         sendResumeToServerAsync,
         updateLocalState,
         updateLocalStateHeader,
         updateLocalStateFooter,
         updateLocalStateSavePrint,
         updateLocalStateBlocks } from 'actions/resumeActions';

// import update                             from 'react/lib/update';
import { styles } from 'styles/ResumeViewStyles';
import { resumeThemes } from 'styles/resumeThemes';
import { RaisedButton, TextField, Paper, SelectField } from 'material-ui/lib';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // this is some voodoo to make SelectField render correctly


const ActionCreators = {
  updateResumeState: updateResumeState,
  sendResumeToServerAsync: sendResumeToServerAsync,
  updateLocalState: updateLocalState,
  updateLocalStateHeader: updateLocalStateHeader,
  updateLocalStateFooter: updateLocalStateFooter,
  updateLocalStateBlocks: updateLocalStateBlocks,
  updateLocalStateSavePrint: updateLocalStateSavePrint,
  moveBlock: moveBlock,
  dropBullet: dropBullet,
  moveBullet: moveBullet
};

const mapStateToProps = (state) => ({
  routerState: state.router,
  resumeState: state.resumeReducer,
  loggedIn: state.titleBarReducer.loggedIn
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch)
});

////////////////////////////////////
//    React DnD functions below   //
////////////////////////////////////


const Types = {
  BLOCK: 'block',
  BULLET: 'bullet'
};

const blockTarget = {
  drop(props, monitor, component) {
    const bulletProps = {
      bulletId: monitor.getItem().bulletId,
      text: monitor.getItem().text
    };

    const blockProps = {
      blockId: monitor.getItem().blockId
    };

    // if (monitor.getItemType() === 'bullet') {
    //   props.actions.dropBullet({
    //     // blocks: component.state.blocks,
    //     targetBlock: monitor.getDropResult(),
    //     droppedBullet: bulletProps
    //   });
    // }
  }
};

@DropTarget([Types.BLOCK, Types.BULLET], blockTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))

///////////////////////////////////////
//   end React DnD functions above   //
///////////////////////////////////////


class ResumeView extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object,
    connectDropTarget: React.PropTypes.func.isRequired,
    loggedIn: React.PropTypes.bool
  }

  constructor (props) {
    super(props);
    this.moveBlock = this.moveBlock.bind(this);
    this.findBlock = this.findBlock.bind(this);
    this.moveBullet = this.moveBullet.bind(this);
    this.findBullet = this.findBullet.bind(this);
  }

  // handleSubmit(props) {
  //   if (props.loggedIn) {
  //     console.log('saving...')
  //     props.actions.sendResumeToServerAsync(props.resumeState);
  //   } else {
  //     alert('To save a resume, please signup above');
  //   }
  // }
  //// remember to pass in props from the component

  handleUpdateLocalState(event, textFieldName, whereFrom) {
    const userInput = event.target.value;

    if (whereFrom === 'header') {
      console.log('updating from header...')
      this.actions.updateLocalStateHeader({textFieldName, userInput, whereFrom});
    } else if (whereFrom === 'footer') {
      console.log('updating from footer...')
      this.actions.updateLocalStateFooter({textFieldName, userInput, whereFrom});
    } else if (whereFrom === 'savePrint') {
      console.log('updating from savePrint...')
      this.actions.updateLocalStateSavePrint({textFieldName, userInput, whereFrom});
    } else {
      console.log('updating from main...')
      this.props.actions.updateLocalState({textFieldName, userInput});
    }
  }

  moveBlock(draggedId, atIndex) {
    const { block, blockIndex } = this.findBlock(draggedId);

    this.props.actions.moveBlock({
      blockIndex: blockIndex,
      atIndex: atIndex,
      block: block,
      blockChildren: this.props.resumeState.blockChildren
    });
  }

  findBlock(draggedId, calledByBullet) {
    const blocks = this.props.resumeState.blockChildren;
    const block = blocks.filter(b => b.blockId === draggedId)[0];

    console.log('block in findBlock: ', block)
    console.log('blockIndex in findBlock: ', blocks.indexOf(block))

    return {
      block,
      blockIndex: blocks.indexOf(block)
    };
  }

  moveBullet(draggedId, atIndex, parentBlockId) {
    const { blockIndex } = this.findBlock(parentBlockId);
    const { bullet, bulletIndex } = this.findBullet(draggedId, blockIndex);

    this.props.actions.moveBullet({
      bulletIndex: bulletIndex,
      atIndex: atIndex,
      bullet: bullet,
      parentBlockIndex: blockIndex,
      blockChildren: this.props.resumeState.blockChildren
    });
  }

  findBullet(draggedId, parentBlockIndex) {
    // const blocks = this.props.resumeState.blockChildren;

    // findBullet is getting called multiple times, we don't want that
    // on subsequent calls, this.props.resumeState.blockChildren becomes undefined
      // where is it being overwritten/mutated?

    const block = this.props.resumeState.blockChildren[parentBlockIndex];
    console.log('props state blockChildren in findBullet: ', this.props.resumeState.blockChildren)
    console.log('block in findBullet: ', block)

    let bullets = [];

    block.bulletChildren.map(bullet =>
      bullets.push(bullet)
    );

    console.log('bullets in findBullet: ', bullets)

    const bullet = bullets.filter(bu => bu.bulletId === draggedId)[0];
    console.log('bullet in findBullet: ', bullet)

    return {
      bullet,
      bulletIndex: bullets.indexOf(bullet)
    };
  }

  render() {
    const { connectDropTarget } = this.props;
    const { blockChildren } = this.props.resumeState.blockChildren;

    return connectDropTarget(
      <div className='container'
           style={styles.container}
           id='resumeContainer'>

        <div className='marginTop'
             style={styles.marginTop} />

        <ResumeSavePrint {...this.props}
                         styles={styles}
                         handleUpdateLocalState={this.handleUpdateLocalState} />

        <Paper style={styles.resumePaper}>
          <ResumeHeader {...this.props}
                        styles={styles}
                        handleUpdateLocalState={this.handleUpdateLocalState} />

            {this.props.resumeState.blockChildren.map(block => {
              return (
                <BlockDumbComp  {...this.props}
                                styles={styles}
                                key={block.blockId}
                                blockId={block.blockId}
                                companyName={block.companyName}
                                jobTitle={block.jobTitle}
                                years={block.years}
                                bulletChildren={block.bulletChildren}
                                location={block.location}
                                moveBlock={this.moveBlock}
                                findBlock={this.findBlock} >

                    {block.bulletChildren.map(bullet => {
                      return (
                          <Bullet key={bullet.bulletId}
                            bulletId={bullet.bulletId}
                            parentBlockId={bullet.parentBlockId}
                            text={bullet.text}
                            moveBullet={this.moveBullet}
                            findBullet={this.findBullet}
                            findBlock={this.findBlock} />
                      );
                    })}
                </BlockDumbComp>
                );
            })}

          <ResumeFooter {...this.props}
                        styles={styles}
                        handleUpdateLocalState={this.handleUpdateLocalState} />

          <div className='marginBottom'
               style={styles.marginBottom} />
        </Paper>


        <ResumeSavePrint {...this.props}
                         styles={styles}
                         handleUpdateLocalState={this.handleUpdateLocalState}
                         handleSubmit={this.handleSubmit}
                         handlePrint={this.handlePrint}
                         handleChangeTheme={this.handleChangeTheme}/>

      </div>
    );
  }
} // end react component ResumeView


// /////////////////////////////////////////////////////////////////////////////////////
// //    Resume Footer, super dumb comp is here instead of being a separate file      //
// /////////////////////////////////////////////////////////////////////////////////////
// class ResumeFooter extends React.Component {
//   render() {
//     return (
//       <div>
//         <div style={this.props.styles.plain}>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school1-name'
//                      hintText={this.props.resumeState.resumeFooter.school1.name}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school1-name', 'footer')} />
//           <div style={this.props.styles.pipe}> | </div>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school1-degree'
//                      hintText={this.props.resumeState.resumeFooter.school1.degree}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school1-degree', 'footer')} />
//           <div style={this.props.styles.pipe}> | </div>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school1-schoolEndYear'
//                      hintText={this.props.resumeState.resumeFooter.school1.schoolEndYear}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school1-schoolEndYear', 'footer')} />
//           <div style={this.props.styles.pipe}> | </div>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school1-location'
//                      hintText={this.props.resumeState.resumeFooter.school1.location}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school1-location', 'footer')} />


//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school2-name'
//                      hintText={this.props.resumeState.resumeFooter.school2.name}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school2-name', 'footer')} />
//           <div style={this.props.styles.pipe}> | </div>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school2-degree'
//                      hintText={this.props.resumeState.resumeFooter.school2.degree}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school2-degree', 'footer')} />
//           <div style={this.props.styles.pipe}> | </div>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school2-schoolEndYear'
//                      hintText={this.props.resumeState.resumeFooter.school2.schoolEndYear}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school2-schoolEndYear', 'footer')} />
//           <div style={this.props.styles.pipe}> | </div>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='school2-location'
//                      hintText={this.props.resumeState.resumeFooter.school2.location}
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'school2-location', 'footer')} />
//         </div>
//         <div style={this.props.styles.plain}>

//         </div>
//         <div style={this.props.styles.plain}>
//           <TextField underlineStyle={this.props.styles.underlineStyle}
//                      underlineFocusStyle={this.props.styles.underlineFocusStyle}
//                      ref='personalStatement'
//                      hintText='Personal Statement'
//                      onBlur={e => this.props.handleUpdateLocalState(e, 'personalStatement', 'footer')} />
//         </div>
//       </div>
//     );
//   }
// }

export default connect(mapStateToProps, mapDispatchToProps)(ResumeView);
