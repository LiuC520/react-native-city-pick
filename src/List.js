
import React, {Component} from 'react';
import {
    BackAndroid,View, Image, TouchableOpacity, Modal, Text, ListView, Platform,Dimensions,StyleSheet,Alert
} from 'react-native';
import _ from 'lodash';
import data from './cities-list/city.json'
const {width,height} = Dimensions.get('window')
const SECTIONHEIGHT = 30,ROWHEIGHT = 40
//这是利用lodash的range和数组的map画出26个英文字母
const letters = _
    .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
    .map(n => String.fromCharCode(n).substr(0))
    letters.splice(14,1)//去掉o和V,这两个下面没有城市
    letters.splice(20,1)//去掉o和V,这两个下面没有城市
let city=[]//城市的数组
var totalheight=[];//每个字母对应的城市和字母的总高度
var that = null
export default class List extends Component {
    
    constructor(props) {
        super(props);
        var getSectionData = (dataBlob, sectionID) => {
        return dataBlob[sectionID];
        };
        var getRowData = (dataBlob, sectionID, rowID) => {
        return dataBlob[rowID];
        };
        this.state={
         dataSource:new ListView.DataSource({
            getRowData: getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }),
        }
    that = this
    }
    componentWillMount () {
        //把城市放到对应的字母中
        for(let j = 0;j<letters.length;j++){
            let each =[]
            for(let i = 0;i<data.CITIES.length;i++){
                if(letters[j] == data.CITIES[i].name_en.substr(0,1) ){
                    each.push(data.CITIES[i].name);
                }
            }
            let _city={}
            _city.index = letters[j]
            _city.name = each
            city.push(_city)
        }
    }

componentDidMount () {
    var dataBlob = {};
    var sectionIDs = [];
    var rowIDs = [];

    for(let ii = 0;ii<city.length;ii++){
        var sectionName = 'Section ' + ii;
        sectionIDs.push(sectionName)
        dataBlob[sectionName] = letters[ii]
        rowIDs[ii] = [];
        
        for(let j = 0;j<city[ii].name.length;j++){
            var rowName = ii + '-' + j;
            rowIDs[ii].push(rowName)
            dataBlob[rowName] = city[ii].name[j]
        }
        //计算每个字母和下面城市的总高度，递增放到数组中
        // var eachheight = this.props.sectionHeight+this.props.rowHeight*newcity.length
        var eachheight = SECTIONHEIGHT+ROWHEIGHT*city[ii].name.length
        totalheight.push(eachheight)
    }
    this.setState({
            dataSource:this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
        })
        //处理android的返回事件
      BackAndroid.addEventListener('hardwareBackPress', function() {
            that.props.navigator.pop();
            return true;
      })
}
    componentWillUnmount(){
        BackAndroid.removeEventListener('hardwareBackPress');
    }

    renderRow(rowData,rowId){
        return (
            <TouchableOpacity
            key={rowId}
            style={{height:ROWHEIGHT,justifyContent:'center',paddingLeft:20,paddingRight:30}}
             onPress={()=>{that.changedata(rowData)}}>
             <View style={styles.rowdata}><Text>{rowData}</Text></View>
                
            </TouchableOpacity>
        )
    }
    renderSectionHeader = (sectionData, sectionID) => {
        return (
        <View style={{height:SECTIONHEIGHT,justifyContent:'center',paddingLeft:5}}>
            <Text  style={{color:'rgb(40,169,185)',fontWeight:'bold'}}>
            {sectionData}
            </Text>
        </View>
        )
    }
    // render ringht index Letters
    renderLetters(letter, index) {
        return (
            <TouchableOpacity key={index} activeOpacity={0.6} onPress={()=>{this.scrollTo(index)}}>
                <View style={styles.letter}>
                    <Text style={styles.letterText}>{letter}</Text>
                </View>
            </TouchableOpacity>
        )
    }
        //回调改变显示的城市
    changedata=(cityname)=>{
        this.props.changeCity(cityname)
        this.props.navigator.pop();
    }
    
    //touch right indexLetters, scroll the left
    scrollTo=(index)=>{
        let position=0;
        for(let i = 0;i<index;i++){
            position += totalheight[i]
        }       
        this._listView.scrollTo({
            y:position
        })
    }
    
    render() {
        return (
            <View style={{height: Dimensions.get('window').height,marginBottom:10}}>
                <ListView
                contentContainerStyle={styles.contentContainer}
                ref={listView => this._listView = listView}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSectionHeader={this.renderSectionHeader}
                enableEmptySections={true}
                initialListSize={500}
                
                />
                <View style={styles.letters}>
                    {letters.map((letter, index) => this.renderLetters(letter, index))}
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    contentContainer: {
        width: width,
        backgroundColor: 'white',
    },
    letters: {
        position: 'absolute',
        height: height,
        top: 0,
        bottom: 0,
        right: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        height: height*3.3/100,
        width: width*3/50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterText: {
        textAlign: 'center',
        fontSize: height*1.1/50,
        color:'rgb(40,169,185)'
    },
    rowdata:{
        borderBottomColor:'#faf0e6',
        borderBottomWidth:0.5
    }
})