import {StyleSheet, TouchableOpacity, Text, View, Dimensions, Modal} from 'react-native';
import {useState} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import Debit from './Debit';
import Credit from './Credit';

const {height, width} = Dimensions.get('window');
let h2 = width*.6;
let h3 = height*.3;

export default function Layout(props) {
  
  const c1 = 'cyan', c2 = 'white';
  const h1 = height*.20;
  let now = new Date();
  
  const [m, setM] = useState(parseInt(now.getMonth()));
  const months = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];

  const [color1, setColor1] = useState(c1);
  const [color2, setColor2] = useState(c2);
  const [color3, setColor3] = useState(c2);
  const [modalDis1, setModalDis1] = useState(false);
  const [state, setState] = useState(<Credit companyName={props.companyName + '/' + months[m]} nam={props.nam}/>);
  const [mounting, setMounting] = useState('c');

  const credit = (mon) => {setColor3(c2); setColor2(c2); setColor1(c1);setState(<Credit companyName={props.companyName + '/' + months[mon]} nam={props.nam}/>); setMounting('c');};
  const debit = (mon) => {setColor3(c2); setColor2(c1); setColor1(c2);setState(<Debit companyName={props.companyName + '/' + months[mon]} nam={props.nam}/>); setMounting('d');};
  const ration = (mon) => {}
  const elect = (mon) => {}
  const water = (mon) => {}
  const gas = (mon) => {}

  return (
    <>
      <View style = {{height:h1}}>

        
        <View style = {{height:'32%', backgroundColor:'black', alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'cyan'}}><Text style = {{color:'white', fontWeight:'bold'}}>My</Text> Khata</Text>
        </View>
        <View style = {{height: '35%', backgroundColor:'hsl(222, 14%, 10%)', flexDirection: 'row'}}>
          <TouchableOpacity style = {{...styles.text, width: '20%'}} onPress={()=>{ration(m)}}><Text style={{color:color1, fontSize: 12}}>Ration</Text></TouchableOpacity>
          <TouchableOpacity style = {{...styles.text, width: '20%'}} onPress={()=>{elect(m)}}><Text style={{color:color2, fontSize: 12}}>Electricity</Text></TouchableOpacity> 
          <TouchableOpacity style = {{...styles.text, width: '20%'}} onPress={()=>{water(m)}}><Text style={{color:color1, fontSize: 12}}>Water</Text></TouchableOpacity>
          <TouchableOpacity style = {{...styles.text, width: '20%'}} onPress={()=>{gas(m)}}><Text style={{color:color2, fontSize: 12}}>Gas</Text></TouchableOpacity> 
          <View style={{alignItems:'center', justifyContent:'center', width:'20%', height:'100%'}}>
          <Icon 
              name='three-bars' 
              size={20} 
              color={color3}
              onPress={()=>{setColor3(c1); setColor2(c2); setColor1(c2); setModalDis1(true);}}
            />
          </View>
        </View>
        <View style = {{flexDirection: 'row', height:'33%'}}>
          <TouchableOpacity style = {{...styles.text, ...{backgroundColor: '#272c3b'}}} onPress={()=>{credit(m)}}><Text style={{color:color1}}>Credit</Text></TouchableOpacity>
          <TouchableOpacity style = {{...styles.text, ...{backgroundColor: '#272c3b'}}} onPress={()=>{debit(m)}}><Text style={{color:color2}}>Debit</Text></TouchableOpacity> 
          
        </View>
      </View>
      <Modal transparent={true} visible={modalDis1} onRequestClose={()=>setModalDis1(!modalDis1)}>
          <View style={{marginTop:'60%', ...styles.centeredView, paddingTop:'2%', paddingBottom: '2%', justifyContent:'space-around'}}>
              <TouchableOpacity style={styles.button} onPress={()=>{(mounting=='c')?debit(m-1):credit(m-1);setModalDis1(false);setM(m-1);}}><Text style={{color:'white'}}>Previous Month</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={()=>{(mounting=='c')?debit(parseInt(now.getMonth())):credit(parseInt(now.getMonth()));setModalDis1(false); setM(parseInt(now.getMonth()));}}><Text style={{color:'white'}}>Current Month</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={props.showConfirmDialog}><Text style={{color:'white'}}>Log out</Text></TouchableOpacity>
          </View>
      </Modal>
      { state }
    </>
  );
  
}

const styles = StyleSheet.create({
  text:{alignItems:'center', justifyContent:'center', width:'50%', height:'100%'},
  centeredView: {
    width:h2,
    height:h3,
    alignItems: "center",
    marginLeft:'20%',
    backgroundColor: "white",
    borderRadius: 20,
    paddingRight: 25,
    paddingLeft: 25,
    elevation: 40
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    height:'22%',
    backgroundColor:'#2fc2fc',
    borderRadius:8,
    width:'100%',
    elevation: 6,
  }
})