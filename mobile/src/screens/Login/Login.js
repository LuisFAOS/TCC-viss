import React, { useState, useContext } from 'react';


import { 
    Container, 
    Button,
    ButtonText,
    TipsContainer,
    TipsText,
    Logo
} from './styles'

import { 
    Text, 
    KeyboardAvoidingView, 
    Keyboard, 
    TouchableWithoutFeedback,
    Animated,
    TouchableOpacity
} from 'react-native'


import LogoImg from '../../assets/logo.png'
import CheckBox from '../../components/Checkbox/Checkbox'

import InputBox from '../../components/InputBox/InputBox'
import AlertModal from '../../components/AlertModal/AlertModal';
import baseURL from '../../baseURL';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import AuthContext from '../../context/context'
import HideKeyboardContext from '../../context/hideTabContext';

export default function Login({ navigation }) {

    const {singIn} = useContext(AuthContext)

    const [isSelected, setIsSelected] = useState(true)
    
    const [login, setLogin] = useState({
        email: '',
        senha: ''
    })

    const [alert, setAlert] = useState({
        alertTxt: '',
        isLoading:false,
    })

    const Logar = async () => {
        try {

            Keyboard.dismiss()
            
            setAlert({
                alertTxt: 'Carregando...',
                isLoading: true
            })
            const response = await fetch(baseURL+'user/login', {
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(login)
            })

            if (response.status >= 400) var AuthError = 'Email/senha inválido(s)!'
        
            else {
                var AuthDatas = await response.json() 

                singIn(AuthDatas)
            }

            setAlert({
                alertTxt: AuthError,
                isLoading: false
            })
            
        } catch (e) {

            setAlert({
                alertTxt: 'Servidores com problema, perdão.',
                isLoading: false
            })

            console.log("ERRO ENCONTRADO:\n"+e)
        }
    }

    const {isKeyboardOpen, image} = useContext(HideKeyboardContext)

    return (
            <Container colors={['black', 'green']}>
                {
                    alert.alertTxt ? (
                        <AlertModal
                            pressed={() => !alert.isLoading && setAlert({alertTxt:'', isLoading: false})}
                            isLoading={alert.isLoading}
                            alertTxt={alert.alertTxt}
                        />
                    ): <></>
                }
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior='padding'>

                        <Logo
                            isKeyboardOpen={isKeyboardOpen}
                            style={{
                                transform: [{ scale: image }]
                            }}
                            source={LogoImg}
                        />

                        <InputBox 
                            placeholder="Usuário" 
                            iconName="person" 
                            size={35}
                            
                            onChangeText={email => setLogin({email, senha: login.senha})}
                            value={login.email}
                        />
                        <PasswordInput 
                            placeholder="Senha" 
                            iconName="vpn-key" 
                            size={35}     

                            onChangeText={senha => setLogin({email: login.email, senha})}
                            value={login.senha}
                            />
                        <TipsContainer>
                            <TipsText>
                                <CheckBox
                                    selected={isSelected} 
                                    onPress={()=> setIsSelected(!isSelected)}
                                    text='Lembrar-me!'
                                />
                            </TipsText>
                            <TipsText>
                                <TouchableOpacity onPress={()=> navigation.replace('ForgotPassword')}>
                                    <Text style={{color: 'white'}}>Esqueceu a senha?</Text>
                                </TouchableOpacity>
                            </TipsText>
                        </TipsContainer>
                        <Button onPress={Logar}>
                            <ButtonText>
                                ENTRAR
                            </ButtonText>
                        </Button>
                        <Button onPress={()=> navigation.replace('SingUp')}>
                            <ButtonText>
                                CADASTRAR
                            </ButtonText>
                        </Button>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Container>

        );
    }
