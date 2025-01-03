import React, { useRef } from 'react';
import { View, TextInput, Dimensions } from 'react-native';

const OTPInput = ({ value, onChangeText, nextRef, currentRef }) => (
    <View style={{
        alignItems: 'center', justifyContent: 'center',
        width: Dimensions.get('window').width / 8,
        height: Dimensions.get('window').width / 8,
        borderWidth: 1, borderRadius: 10,
        borderColor: 'lightgray'
    }}>
        <TextInput
            value={value}
            onChangeText={(tx) => {
                onChangeText(tx);
                if (tx && nextRef) {
                    nextRef.current.focus();
                }
            }}
            style={{
                fontSize: 18, fontWeight: 'bold',
                textAlign: 'center'
            }}
            cursorColor={"black"}
            ref={currentRef}
            maxLength={1}
            keyboardType="numeric"
        />
    </View>
);

const OTPInputContainer = ({ code1, code2, code3, code4, code5, code6, setCode1, setCode2, setCode3, setCode4, setCode5, setCode6 }) => {
    const code1Ref = useRef(null);
    const code2Ref = useRef(null);
    const code3Ref = useRef(null);
    const code4Ref = useRef(null);
    const code5Ref = useRef(null);
    const code6Ref = useRef(null);

    return (
        <View style={{
            marginTop: 30, flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-around'
        }}>
            <OTPInput value={code1} onChangeText={setCode1} nextRef={code2Ref} currentRef={code1Ref} />
        </View>
    );
};

export default OTPInputContainer;
