import {View, TextInput, Text, StyleSheet, TouchableOpacity, Modal, Alert} from 'react-native';
import {useState} from 'react'
import Layout from './components/Layout';
import { StatusBar } from 'expo-status-bar';
import { dbref, storeData } from './database';
import {get, child} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

const storeAsync = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('User', jsonValue);
  } catch (e) {
    console.log(e);
  }
}


const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('User');
    return jsonValue? JSON.parse(jsonValue) : {};
  } catch(e) {
    console.log(e);
  }
}

const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    console.log("done");
  }
}


function App(){
    const [companyName, setCompanyName] = useState('');    
    const [companyPassword, setCompanyPassword] = useState('');    
    const [nam, setNam] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName1, setCompanyName1] = useState('');    
    const [companyPassword1, setCompanyPassword1] = useState('');    
    const [nam1, setNam1] = useState('');
    const [modalDis, setModalDis] = useState('');
    const [done, setDone] = useState(true);
    const [modalDis1, setModalDis1] = useState(false);
    
    getData().then((data) => {setCompanyName1(data.Group?data.Group:'');setCompanyPassword1(data.Password?data.Password:'');setNam1(data.Name?data.Name:'');setDone(false);})
    
    const showConfirmDialog = () => {
      
      Alert.alert(
        "Confirmation", "Are you sure to log out?",
        [
          {
            text: "Yes",
            onPress: () => {
              clearAll();
              setCompanyName1('');setCompanyPassword1('');setNam1('');
            }
          },
          {
            text: "No"
          }
        ]
      );
    };

    const createGroup = () => {
      if(companyPassword.length<6){
        alert("Password length should be minimum 6");
        return;
      }
      if(companyPassword !== confirmPassword){
        alert("Passwords did not match");
        return;
      }
      get(child(dbref, companyName+companyPassword)).then((snapshot) => {
        if(!snapshot.val()){
          storeAsync({Group:companyName, Password:companyPassword, Name:nam});
          setCompanyName1(companyName);setCompanyPassword1(companyPassword);setNam1(nam);
          setCompanyName('');setCompanyPassword('');setNam('');setConfirmPassword('');
          setModalDis(false);
          storeData(companyName+companyPassword, 'Existence', true);
        }
        else{
          alert("Group already exists");
          setCompanyName('');setCompanyPassword('');setNam('');setConfirmPassword('');

        }
      }).catch(() => alert('You are offline. Check your connections..'));
    }

    const joinGroup = () => {
      if(companyPassword.length<6){
        alert("Password length should be minimum 6");
        return;
      }

      get(child(dbref, companyName+companyPassword)).then((snapshot) => {
        if(snapshot.val()){
          storeAsync({Group:companyName, Password:companyPassword, Name:nam});
          setCompanyName1(companyName);setCompanyPassword1(companyPassword);setNam1(nam);
          setCompanyName('');setCompanyPassword('');setNam('');setConfirmPassword('');
          setModalDis1(false);
        }
        else{
          alert("Group doesn't exist");
          setCompanyName('');setCompanyPassword('');setNam('');setConfirmPassword('');
        }
      }).catch(() => alert('You are offline. Check your connections..'));
    }
    
    if(done)return(<>
      <StatusBar></StatusBar>
        <View style = {{height: '6%', backgroundColor:'hsl(222, 14%, 10%)'}}></View>
        <View style = {{height:'8%', backgroundColor:'hsl(222, 14%, 10%)', alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'cyan'}}><Text style = {{color:'white', fontWeight:'bold'}}>My</Text> Khata</Text>
      </View>
      <Spinner
        overlayColor='hsl(222, 14%, 10%)'
        color='cyan'
        size = 'large'
        animation='fade'
        visible={done}
        textContent={'Loading..'}
        textStyle = {{color:'white', fontSize:15}}
    /></>)

    else if(companyName1==='' || companyPassword1==='' || nam1===''){
      return(
        <View style={{flex:1}}>
          <StatusBar></StatusBar>
        <View style = {{height: '6%', backgroundColor:'hsl(222, 14%, 10%)'}}></View>
        <View style = {{height:'8%', backgroundColor:'hsl(222, 14%, 10%)', alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'cyan'}}><Text style = {{color:'white', fontWeight:'bold'}}>My</Text> Khata</Text>
        </View>

        <View style={{flex:1, backgroundColor:'#313343', ...styles.centeredView, justifyContent:'center'}}>
            <TouchableOpacity style={{...styles.button}} onPress={()=>{setModalDis(true)}}><Text>Create a new Group</Text></TouchableOpacity>
            <TouchableOpacity style={{...styles.button}} onPress={()=>{setModalDis1(true)}}><Text>Join a existing Group</Text></TouchableOpacity>
        </View>

        <Modal transparent={true} visible={modalDis} onRequestClose={()=>setModalDis(!modalDis)}>
          <View style={{flex:1, backgroundColor:'#313343', ...styles.centeredView, justifyContent:'center'}}>
            <TextInput style={styles.textinput} placeholder='Your Group Name..' value={companyName} onChangeText={text => setCompanyName(text)}/>
            <TextInput style={styles.textinput} secureTextEntry={true} placeholder='Your Group Password..' value={companyPassword} onChangeText={text => setCompanyPassword(text)}/>
            <TextInput style={styles.textinput} secureTextEntry={true} placeholder='Confirm Password..' value={confirmPassword} onChangeText={text => setConfirmPassword(text)}/>
            <TextInput style={styles.textinput} placeholder='Your Full Name..' value={nam} onChangeText={text => setNam(text)}/>
            <TouchableOpacity style={{marginTop:40, ...styles.button, width:'50%'}} onPress={createGroup}>
                <Text style={{fontWeight:'bold'}}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal transparent={true} visible={modalDis1} onRequestClose={()=>setModalDis1(!modalDis1)}>
          <View style={{flex:1, backgroundColor:'#313343', ...styles.centeredView, justifyContent:'center'}}>
            <TextInput style={styles.textinput} placeholder='Your Group Name..' value={companyName} onChangeText={text => setCompanyName(text)}/>
            <TextInput style={styles.textinput} secureTextEntry={true} placeholder='Your Group Password..' value={companyPassword} onChangeText={text => setCompanyPassword(text)}/>
            <TextInput style={styles.textinput} placeholder='Your Full Name..' value={nam} onChangeText={text => setNam(text)}/>
            <TouchableOpacity style={{marginTop:40, ...styles.button, width:'50%'}} onPress={joinGroup}>
                <Text style={{fontWeight:'bold'}}>Join Group</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>);
    }
    return(<Layout companyName={companyName1+companyPassword1} nam={nam1} showConfirmDialog={showConfirmDialog}/>);
}

export {App};


const styles = StyleSheet.create({
  centeredView: {
    width:'100%',
    height:'86%',
    alignItems: "center",
    
  },
  textinput:{
      borderRadius:10,
      backgroundColor:'white',
      padding:12,
      width:'70%',
      marginTop:50
  },
  button:{
      marginBottom:40,
      backgroundColor:'cyan',
      alignItems: "center",
      justifyContent:'center',
      padding: 12,
      borderRadius:20,
      width:'60%'
  }
});

