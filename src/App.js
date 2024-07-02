import './App.css';
import MatrixAnimation from "./MatrixAnimation";
import {useState} from "react";
import {EndUser, EndUserConstants} from "euscp";
import axios from "axios";

const euSignConfig =  {
    language: 'ua',
    encoding: 'utf-8',
    httpProxyServiceURL: '/',
    directAccess: true,
    CAs: '/static/CAs.json',
    CACertificates: '/static/CACertificates.p7b'
};

function App() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState(null);

    function readFileFromFS(file) {
        if (file.contents) {
            return Promise.resolve(file);
        }
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = event => resolve({
                name: file.name,
                contents: Buffer.from(event.target.result),
            });
            reader.readAsArrayBuffer(file);
        });
    }

    const initEuSign = async (euSettings) => {
        if(!this.euSign) {
            this.euSign = new EndUser(
                '../../../vendor/euSign/euscp.worker.ex-1.3.69.js',
                EndUserConstants.EndUserLibraryType.JS
            );
        }

        await this.euSign.Initialize(euSettings);
        console.log(`isInitialized: ${await this.euSign.IsInitialized()}`)
    }

    const signIpn = async (file) => {
        try{
            await initEuSign(euSignConfig);

            const { contents } = await readFileFromFS(file);
            const jpkKeys = await this.euSign.GetJKSPrivateKeys(contents);
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

            await this.euSign.ReadPrivateKeyBinary(contents, 'HtyfnFcflekjd20');

            const signedIpn = await this.euSign.SignDataInternal(
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
              await signIpn(file);
    }

    return (
        <div id="root" style={{}}>
            <input type="file"/>
            <button onClick={handleSubmit}>Click me</button>
        </div>
    );
}

export default App;
