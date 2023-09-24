import { View, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import { dbref } from '../database';
import {child, get, push, update } from 'firebase/database';
import {LinearGradient} from 'expo-linear-gradient'

const {height, width} = Dimensions.get('window');
let h1 = height*.06;
let h2 = height*.10;
let h3 = height*.60;
let h4 = height*.07;

export default function Debit(props){
    let now = new Date();
    let date = now.getDate()+'/'+(parseInt(now.getMonth())+1)+'/'+now.getFullYear();
    const [p, sP] = useState('');
    const [a, sA] = useState('');
    const [rows, setRows] = useState([]);
    const [dep, setDep] = useState(0);
    const [total, setTotal] = useState(0);
    const [rem, setRem] = useState(0);

    useEffect(() => {
        get(child(dbref, props.companyName+ '/' + 'Debit')).then((snapshot) => {let r = snapshot.val()?snapshot.val():[];r.reverse();setRows(r);
            get(child(dbref, props.companyName+ '/' + 'Total')).then((snapshot1) => {
                let t = snapshot1.val()?snapshot1.val():{'TotalPaid':0, 'TotalSpend':0};
                let ts = t.TotalSpend?t.TotalSpend:0;
                let tp = t.TotalPaid?t.TotalPaid:0;
                setTotal(ts);
                setRem(parseFloat(tp)-parseFloat(ts));});
        }).catch(() => alert('You are offline. Check your connections..'));}, [dep]
    )

    const add = () => {
        if(p!='' && !isNaN(parseFloat(a))){
            get(child(dbref, props.companyName+ '/' + 'Debit')).then((snapshot) => {
                const updates = {};
                const data = snapshot.val()?snapshot.val():[];
                const newKey = push(child(dbref, props.companyName+ '/' + 'Debit')).key;
                updates['/' + props.companyName+ '/' + 'Debit/'+ data.length.toString()] = {id:newKey, title:[date, p, a, props.nam]};
                update(dbref, updates);
                const debitlist = {};
                const k = push(child(dbref, props.companyName+ '/' + 'DebitHistory/' + props.nam)).key;
                debitlist['/' + props.companyName+ '/' + 'DebitHistory/' + props.nam + '/' +k] = {id:k, title:[date, a, p]};
                update(dbref, debitlist);

                get(child(dbref, props.companyName+ '/' + 'Total/TotalSpend')).then((snapshot1) => {
                    let ts = snapshot1.val()?snapshot1.val():0;
                    let temp = {};
                    temp['/' + props.companyName+ '/' + 'Total/TotalSpend'] = parseFloat(ts)+parseFloat(a);
                    update(dbref, temp);
                }).catch(() => alert('You are offline. Check your connections..'));
                
                sP('');
                sA('');
                setDep(dep+1);
            }).catch(() => alert('You are offline. Check your connections..'));
            
        }
    };

    const renderItem = (row) => {
        return(<Row style={{height:h1}}>
        <Col style = {styles.cell}><Text style={{fontSize:12}}>{row.item.title[0]}</Text></Col>
        <Col style = {styles.cell}><Text style={{fontSize:12}}>{row.item.title[1]}</Text></Col>
        <Col style = {styles.cell}><Text style={{fontSize:12}}>{row.item.title[2]}</Text></Col>
        <Col style = {styles.cell}><Text style={{fontSize:12}}>{row.item.title[3]}</Text></Col>
        </Row>)
    }

    return(
        <View style={{flex:1}}>
            <ImageBackground source={require('../assets/bg.jpg')} resizeMode='cover' style={{backgroundColor: '#ccc',
                flex: 1}}>
            <View style={{height: h4}}>
                <Grid>
                    <Row>
                        <Col><LinearGradient colors={['#0778fa', '#07b5fa', 'cyan']}  style = {{...styles.cell}}><Text style={{fontSize:13}}>Date</Text></LinearGradient></Col>
                        <Col><LinearGradient colors={['#0778fa', '#07b5fa', 'cyan']}  style = {{...styles.cell}}><Text style={{fontSize:13}}>Particular</Text></LinearGradient></Col>
                        <Col><LinearGradient colors={['#0778fa', '#07b5fa', 'cyan']}  style = {{...styles.cell}}><Text style={{fontSize:13}}>Amount</Text></LinearGradient></Col>
                        <Col><LinearGradient colors={['#0778fa', '#07b5fa', 'cyan']}  style = {{...styles.cell}}><Text style={{fontSize:13}}>Edited By</Text></LinearGradient></Col>
                    </Row>
                </Grid>
            </View>
            <View style={{height:h1*10}}>
                <Grid>
                    <Row style={{height:h1}}>
                        <Col style = {styles.cell}><Text style={{fontSize:12}}>{date}</Text></Col>
                        <Col style = {styles.cell}><TextInput value={p} onChangeText={text => sP(text)}/></Col>
                        <Col style = {styles.cell}><TextInput value={a} keyboardType='numeric' onChangeText={text => sA(text)}/></Col>
                        <Col style = {styles.cell}><Text style={{fontSize:12}}>{props.nam}</Text></Col>
                    </Row>
                    <FlatList data = {rows} renderItem = {renderItem} keyExtractor={item=>item.id}/>
                </Grid>
            </View>
                
            
            <View style={{height:h2, position:'absolute', width:'100%', bottom:10, flexDirection:'row', justifyContent:'space-around'}}>
                
                <View style={{width:'60%', backgroundColor:'#191c3e', borderRadius:40, ...styles.center, elevation:7}}>
                    <Text style={{color:'white'}}>Total Spend: {total}</Text>
                    <Text style={{color:'cyan'}}>Remaining: {rem}</Text>
                </View>
                <TouchableOpacity style={{backgroundColor:'#191c3e', width:'20%', borderRadius:h2/2, ...styles.center, elevation:7}} onPress={add}>
                    <Icon 
                    name='plus' 
                    size={50} 
                    color={'cyan'}/>
                </TouchableOpacity>
            </View>
            </ImageBackground>
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
  center:{justifyContent: 'center',
  alignItems: 'center'}
})