import './App.css';
import MatrixAnimation from "./MatrixAnimation";
import {useEffect, useState} from "react";
import {EndUser, EndUserConstants} from "euscp";
import axios from "axios";
import { Buffer } from 'buffer';

const euSignConfig =  {
    language: 'ua',
    encoding: 'utf-8',
    httpProxyServiceURL: '/',
    directAccess: true,
    CAs: '/static/CAs.json',
    CACertificates: '/static/CACertificates.p7b'
};

function App() {
    const [buffer, setBuffer] = useState(null);
    const [keyFile, setKeyFile] = useState(null);
    let euSign = null;

    useEffect(() => {
        console.log()
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const buffer = Buffer.from(arrayBuffer);
            setBuffer(buffer);
        };

        reader.readAsArrayBuffer(file);
    };

    const initEuSign = async (euSettings) => {
        if(!euSign) {
            euSign = new EndUser(
                '../euSign/euscp.worker.ex-1.3.69.js',
                EndUserConstants.EndUserLibraryType.JS
            );
        }

        await euSign.Initialize(euSettings);
        console.log(`isInitialized: ${await euSign.IsInitialized()}`)
    }

    const signIpn = async (file) => {
        try{
            console.log('heyFile', keyFile);
            console.log('buffer', buffer);
            await initEuSign(euSignConfig);

            await euSign.ReadPrivateKeyBinary(file, 'HtyfnFcflekjd20');
            console.log('we here');
            const jpkKeys = await euSign.GetJKSPrivateKeys(file);
            console.log(jpkKeys);
            const lastCert = jpkKeys[0].certificates.length - 1;
            const {
                privKeyEndTime, // конец действия сертификата
                issuerCN, // АЦСК
                subjDRFOCode, // ИНН
                subjEDRPOUCode, // ЕДРПО
                subjFullName, // Имя владельца сертификата
                subjOrg, // Организация владельца сертификата
                subjTitle, // Должность владельца сертификата
                publicKeyID // открытый ключ сертификата (его нужно еще слепить( publicKeyID.replace(/ /g, '')))
            } = jpkKeys[0].certificates[lastCert].infoEx;


            const signedIpn = await euSign.SignDataInternal(
                true,
                subjDRFOCode,
                true,
            );

            const reees = await axios.get('https://prro.poster.pos/getDFSData', {
                headers: {
                    Authorization: signedIpn,
                }
            });

            console.log(reees);

            return signedIpn;
        } catch (error) {
            console.log('ERRROROROOR', error);
        }
    }


    const handleSubmit = async () => {
              await signIpn(buffer);
    }

    return (
        <div id="root" style={{}}>
            {/*<input type="file" onChange={handleFileChange}/>*/}
            <button onClick={handleSubmit}>Click second</button>
            <input type="file" onChange={handleFileChange} />
            {buffer && <p>File read into buffer: {buffer.toString('hex')}</p>}
        </div>
    );
}

export default App;
