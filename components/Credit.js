import {Text, View, Dimensions, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, Alert, ImageBackground, FlatList, Keyboard} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import { storeData, dbref} from '../database';
import {child, get, push, update } from 'firebase/database';
import { LinearGradient } from 'expo-linear-gradient';

const {height, width} = Dimensions.get('window');
let h1 = height*.07;
let h2 = width*.6;
let h3 = height*.3;
let h4 = width*.7;

export default function Credit(props){
    const [rows, setRows] = useState([]);
    const [mt, setMt] = useState('60%');
    const [nam, setNam] = useState('');
    const [totalMoney, setTotalMoney] = useState('');
    const [money, setMoney] = useState('');
    const [modalDis, setModalDis] = useState(false);
    const [modalDis1, setModalDis1] = useState(false);
    const [modalDis2, setModalDis2] = useState(false);
    const [modalDis3, setModalDis3] = useState(false);
    const [modalDis4, setModalDis4] = useState(false);
    const [dep, setDep] = useState(0);
    const [creditHistoryRows, setCreditHistoryRows] = useState(false);
    const [debitHistoryRows, setDebitHistoryRows] = useState(false);
    const [creditHistoryName, setCreditHistoryName] = useState('');
    const [creditHistoryAddedOn, setCreditHistoryAddedOn] = useState('');
    const [contact, setContact] = useState('');
    const [addedBy, setAddedBy] = useState('');
    const [number, setNumber] = useState('');

    const addPerson = () => setModalDis(true); 
    
    useEffect(() => {
        get(child(dbref, props.companyName+ '/' + 'Credit')).then((snapshot) => {let r = snapshot.val()?snapshot.val():[];r.reverse();setRows(r);}).catch(() => alert('You are offline. Check your connections..'));}, [dep]
    )

    const add = () => {
        setModalDis(false);
        if(contact.length!==10){
            alert("Whatsapp number should be 10 digits");
            return;
        }

        if(nam!='' && !isNaN(parseFloat(totalMoney))){
            get(child(dbref, props.companyName+ '/' + 'Credit')).then((snapshot) => {
                const updates = {};
                const data = snapshot.val()?snapshot.val():[];
                const newKey = push(child(dbref, props.companyName+ '/' + 'Credit')).key;
                let now = new Date();
                let date = now.getDate()+'/'+(parseInt(now.getMonth())+1)+'/'+now.getFullYear();
                updates['/' + props.companyName+ '/' + 'Credit/'+ data.length.toString()] = {id:newKey, title:[nam, 0, totalMoney, totalMoney, date, contact, props.nam]};
                update(dbref, updates);
                setNam('');
                setTotalMoney('');
                setContact('');
                setDep(dep+1);
            }).catch(() => alert('You are offline. Check your connections..'));
        }
    }

    const addMoney = () => {
        let m = parseFloat(money);
        setModalDis2(false);
        if(!isNaN(m)){
            get(child(dbref, props.companyName+ '/' + 'Credit')).then((snapshot) => {
                const updates = {};
                const data = snapshot.val();
                for(let i in data){
                    if(data[i].id === window.row_.id && 0 <= data[i].title[1]+m <= data[i].title[3]){
                        data[i].title[1] += m;
                        data[i].title[2] -= m;
                        updates['/' + props.companyName+ '/' + 'Credit/'+ i.toString()] = data[i];
                        update(dbref, updates);
                        const creditlist = {};
                        const k = push(child(dbref, props.companyName+ '/' + 'CreditHistory/' + data[i].title[0])).key;
                        let now = new Date();
                        let date = now.getDate()+'/'+(parseInt(now.getMonth())+1)+'/'+now.getFullYear();
                        creditlist['/' + props.companyName+ '/' + 'CreditHistory/' + data[i].title[0] + '/' +k] = {id:k, title:[date, m]}
                        
                        get(child(dbref, props.companyName+ '/' + 'Total/TotalPaid')).then((snapshot1) => {
                            let tp = snapshot1.val()?snapshot1.val():0;
                            let temp = {};
                            temp['/' + props.companyName+ '/' + 'Total/TotalPaid'] = parseFloat(tp)+parseFloat(m);
                            update(dbref, temp);
                        }).catch(() => alert('You are offline. Check your connections..'));

                        update(dbref, creditlist);
                        setDep(dep+1);
                        break;
                    }   
                }
            }).catch(() => alert('You are offline. Check your connections..'));
            setMoney('');
        }
    }
    
    const creditHistory = () => {
        setModalDis1(false);
        setModalDis3(true);
        get(child(dbref, props.companyName+ '/' + 'CreditHistory/'+ window.row_.title[0])).then((snapshot) => {
            let data = snapshot.val()?snapshot.val():{};
            let list = [];
            for(let key in data){
                list.push(data[key]);
            }
            setCreditHistoryName(window.row_.title[0]);
            setNumber(window.row_.title[5]);
            setCreditHistoryAddedOn(window.row_.title[4]);
            setAddedBy(window.row_.title[6]);
            setCreditHistoryRows(list);}).catch(() => alert('You are offline. Check your connections..'));
    }

    const debitHistory = () => {
        setModalDis1(false);
        setModalDis4(true);
        get(child(dbref, props.companyName+ '/' + 'DebitHistory/'+ window.row_.title[0])).then((snapshot) => {
            let data = snapshot.val()?snapshot.val():{};
            let list = [];
            for(let key in data){
                list.push(data[key]);
            }
            setCreditHistoryName(window.row_.title[0]);
            setNumber(window.row_.title[5]);
            setCreditHistoryAddedOn(window.row_.title[4]);
            setAddedBy(window.row_.title[6]);
            setDebitHistoryRows(list);}).catch(() => alert('You are offline. Check your connections..'));
    }

    const deletePerson = () => {
        setModalDis1(false);
        get(child(dbref, props.companyName+ '/' + 'Credit')).then((snapshot) => {
            const data = snapshot.val();
            for(let i in data){
                if(data[i].id === window.row_.id){
                    data.splice(i, 1);
                    storeData(props.companyName, 'Credit', data);
                    storeData(props.companyName, 'CreditHistory/' + window.row_.title[0], null);
                    storeData(props.companyName, 'DebitHistory/' + window.row_.title[0], null);
                    setDep(dep+1);
                    break;
                }   
            }
        }).catch(() => alert('You are offline. Check your connections..'));
    }

    const confirmDelete = () => {
      
        Alert.alert(
          "Confirmation", "Are you sure to remove " + window.row_.title[0] + "?",
          [
            {
              text: "Yes",
              onPress: deletePerson
            },
            {
              text: "No"
            }
          ]
        );
      };

    const renderItem = (row) => {
        return(<Row style={{height:h1}}>
        <Col style = {styles.cell}>
            <Pressable 
                onPress={()=>{window.row_=row.item; setModalDis1(true);}} 
                style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:12}}>{row.item.title[0]}</Text>
            </Pressable>
        </Col>
        <Col style = {styles.cell}><Text style={{fontSize:12}}>{row.item.title[1]}</Text></Col>
        <Col style = {styles.cell}><Text style={{fontSize:12}}>{row.item.title[2]}</Text></Col>
        </Row>)
    }

    const renderItem1 = (row) => {
        return(<Row style={{height:h1}}>
            <Col style = {styles.cell}><Text>{row.item.title[0]}</Text></Col>
            <Col style = {styles.cell}><Text>{row.item.title[1]}</Text></Col>
            </Row>)
    }

    const renderItem2 = (row) => {
        return(<Row style={{height:h1}}>
            <Col style = {styles.cell}><Text>{row.item.title[0]}</Text></Col>
            <Col style = {styles.cell}><Text>{row.item.title[1]}</Text></Col>
            <Col style = {styles.cell}><Text>{row.item.title[2]}</Text></Col>
            </Row>)
    }

    Keyboard.addListener('keyboardDidShow', () => {setMt('30%'); });
    Keyboard.addListener('keyboardDidHide', () => {setMt('60%');});

    return(
        <View style={{flex:1}}>
            <ImageBackground source={require('../assets/bg.jpg')} resizeMode='cover' style={{backgroundColor: '#ccc',
                flex: 1}}>
                <View style={{height:'87%'}}>
                <Grid>
                    <Row style={{height: h1}}>
                    <Col><LinearGradient colors={['#0778fa', '#07b5fa', 'cyan']}  style = {{...styles.cell}}><Text>Name</Text></LinearGradient></Col>
                        <Col><LinearGradient colors={['#0778fa', '#07b5fa', 'cyan']}  style = {{...styles.cell}}><Text>Paid</Text></LinearGradient></Col>
                        <Col><LinearGradient colors={['#0778fa', '#07b5fa', 'cyan']}  style = {{...styles.cell}}><Text>Remaining</Text></LinearGradient></Col>
                    </Row>
                    <FlatList data = {rows} renderItem = {renderItem} keyExtractor={item=>item.id}/>
                </Grid>
                </View>
            </ImageBackground>
            
            
            <Modal animationType='slide' transparent={true} visible={modalDis} onRequestClose={()=>setModalDis(!modalDis)}>
                <View style={{marginTop:mt, ...styles.centeredView, paddingTop: 20,height:height*.45, width:h4, marginLeft:'15%'}}>
                <TextInput style={{...styles.textinput}} placeholder='Enter name..' value={nam} onChangeText={text => setNam(text)}/>
                <TextInput style={styles.textinput} placeholder='Amount per month..' keyboardType='numeric' value={totalMoney} onChangeText={text => setTotalMoney(text)}/>
                <TextInput style={styles.textinput} placeholder="Whats app number.." keyboardType='numeric' value={contact} onChangeText={text => setContact(text)}/>
                <Pressable style={{...styles.plusCentered, marginTop:'7%'}} onPress={add}>
                    <Icon 
                    name='plus' 
                    size={35} 
                    color={'white'}/>
                </Pressable>
                </View>
            </Modal>
            
            <Modal transparent={true} visible={modalDis1} onRequestClose={()=>setModalDis1(!modalDis1)}>
                <View style={{marginTop:mt, ...styles.centeredView, height:height*.4, width:h4, marginLeft:'15%', paddingTop:'5%', paddingBottom: '5%', justifyContent:'space-around'}}>
                    <TouchableOpacity style={styles.button} onPress={()=>{setModalDis1(false); setModalDis2(true);}}><Text style={{color:'white'}}>Add Money</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={creditHistory}><Text style={{color:'white'}}>Credit History</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={debitHistory}><Text style={{color:'white'}}>Debit History</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={confirmDelete}><Text style={{color:'white'}}>Remove Person</Text></TouchableOpacity>
                </View>
            </Modal>

            <Modal transparent={true} visible={modalDis2} onRequestClose={()=>setModalDis2(!modalDis2)}>
                <View style={{marginTop:mt, ...styles.centeredView, justifyContent: 'space-around'}}>
                <TextInput style={styles.textinput} keyboardType='numeric' placeholder='Enter Amount' value={money} onChangeText={text => setMoney(text)}/>
                <Pressable style={{...styles.plusCentered}} onPress={addMoney}>
                    <Icon 
                        name='plus' 
                        size={35} 
                        color={'white'}
                    />
                </Pressable>
                </View>
            </Modal>

            <Modal transparent={true} visible={modalDis3} onRequestClose={()=>setModalDis3(!modalDis3)}>
                <View style={styles.modal3}>
                    <LinearGradient colors={['#0c45ff','#00bfff']} start={{ x: 0.5, y: 0 }} end={{ x: .5, y: 1 }} style={{height: '22%', alignItems:'center', paddingTop:10 , borderWidth: 1, borderBottomWidth:0,  borderColor: 'black'}}>
                         
                        <Text style={{fontWeight:'bold', fontSize:17, color:'white'}}>{creditHistoryName}</Text>
                        <Text style={{color:'white'}}>Contact: {number}</Text>
                        <Text style={{color:'white'}}>Added by: {addedBy}</Text>
                        <Text style={{color:'white'}}>Added on: {creditHistoryAddedOn}</Text>
                    </LinearGradient>
                    
                    <Grid>
                        <Row style={{height: h1}}>
                            <Col><LinearGradient colors={['cyan', '#e8fbfd']} start={{ x: 0.5, y: 0 }} end={{ x: .5, y: 1 }}  style = {{...styles.cell, borderColor:'black'}}><Text>Date</Text></LinearGradient></Col>
                            <Col><LinearGradient colors={['cyan', '#e8fbfd']} start={{ x: 0.5, y: 0 }} end={{ x: .5, y: 1 }}  style = {{...styles.cell, borderColor:'black'}}><Text>Amount Paid</Text></LinearGradient></Col>
                        </Row>
                        <FlatList data = {creditHistoryRows} renderItem = {renderItem1} keyExtractor={item=>item.id}/>
                    </Grid>
                </View>
            </Modal>
            <Modal transparent={true} visible={modalDis4} onRequestClose={()=>setModalDis4(!modalDis4)}>
                <View style={styles.modal3}>
                <LinearGradient colors={['#0c45ff','#00bfff']} start={{ x: 0.5, y: 0 }} end={{ x: .5, y: 1 }} style={{height: '22%', alignItems:'center', paddingTop:10, borderWidth: 1, borderBottomWidth:0,  borderColor: 'black'}}>
                        <Text style={{fontWeight:'bold', color:'white', fontSize:17}}>{creditHistoryName}</Text>
                        <Text style={{color:'white'}}>Contact: {number}</Text>
                        <Text style={{color:'white'}}>Added by: {addedBy}</Text>
                        <Text style={{color:'white'}}>Added on: {creditHistoryAddedOn}</Text>
                    </LinearGradient>
                    <Grid>
                        <Row style={{height: h1}}>
                        <Col><LinearGradient colors={['cyan', '#e8fbfd']} start={{ x: 0.5, y: 0 }} end={{ x: .5, y: 1 }}  style = {{...styles.cell, borderColor:'black'}}><Text>Date</Text></LinearGradient></Col>
                        <Col><LinearGradient colors={['cyan', '#e8fbfd']} start={{ x: 0.5, y: 0 }} end={{ x: .5, y: 1 }}  style = {{...styles.cell, borderColor:'black'}}><Text>Spend</Text></LinearGradient></Col>
                        <Col><LinearGradient colors={['cyan', '#e8fbfd']} start={{ x: 0.5, y: 0 }} end={{ x: .5, y: 1 }}  style = {{...styles.cell, borderColor:'black'}}><Text>Particular</Text></LinearGradient></Col>
                        </Row>
                        <FlatList data = {debitHistoryRows} renderItem = {renderItem2} keyExtractor={item=>item.id}/>
                    </Grid>
                
                </View>
            </Modal>
            <View style={{height:h1, position:'absolute', width:'100%', bottom:15, alignItems:'center'}}>
            <TouchableOpacity style={{height:'100%', width: '60%', backgroundColor:'#191c3e', borderRadius:50, elevation:6, ...styles.center}} onPress={addPerson}><Text style={{color:'white'}}>Add <Text style={{color:'cyan', fontWeight:'bold'}}>Person</Text></Text></TouchableOpacity>
            </View>
            
        </View>
        
    )
}

const styles = StyleSheet.create({cell: {
    borderWidth: 1,
    borderColor: 'white',
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  center:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    height:'18%',
    backgroundColor:'#2fc2fc',
    borderRadius:8,
    width:'100%',
    elevation: 5,
  },
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
  modal3: {
      width: '90%',
      height: '78%',
      backgroundColor: 'white',
      padding:5,
      paddingBottom:10,
      justifyContent: 'space-around',
      marginLeft:'5%',
      marginTop: '20%',
      
      elevation:100
  },
  textinput:{
      borderRadius:10,
      elevation:5,
      backgroundColor:'white',
      padding:10,
      width:'100%',
      marginTop:22
  },
  plusCentered:{
    height: 50,
    width:50,
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor:'rgb(132, 192, 245)',
    paddingTop:7,
    elevation:7
  }
})