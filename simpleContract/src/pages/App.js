import '../App.css';
import React, { useEffect, useState } from 'react';
import logoImg from '../assets/vote_logo.png';
import metamaskicon from '../assets/metamask.png';
import Abi from '../abis/contract.json';
import ClipLoader from "react-spinners/ClipLoader";

const contractAddress = '0x5E7fe2e301f1B24B59116C00918A2599df75d1c9';

export default function Dashboard() {
	const [address, setAddress] = useState('');
	const [vote_id, setVoteID] = useState(0);
	// const [secondNum, setsecondNum] = useState(0);
	const [firstNum, setfirstNum] = useState(0);
	const [secondNum, setsecondNum] = useState(0);
	const [result, setResult] = useState(null);
	const [agreeloading, setAgreeloading] = useState(false);
	const [txid, setTxid] = useState(null);
	//const [error_msg, setError_msg] = useState(true);


	useEffect(() => {
		const { ethereum } = window;
		if (ethereum && window.sessionStorage.getItem("connect")) {
			handleConnect();
		}
	}, []);

	// useEffect(()=>{
	// 	const {ethereum, Web3} =  window;
	// 	const web3 = new Web3(ethereum);
	// 	if(txid) {				
	// 		const timer = setTimeout(async() => {
	// 			const receipt = await web3.eth.getTransactionReceipt(txid);
	// 			console.log(receipt);
	// 			if(receipt !== null && receipt.status === true) {
	// 				setAgreeloading(false);
	// 				onResult();
	// 			}
	// 			else {
	// 				console.log("no any transaction!");				
	// 			}
	// 		}, 5000);
	// 		if(timer)
	// 			return () => clearTimeout(timer);	
	// 	}					
	// },[txid]);

	const handleConnect = () => {
		const { ethereum } = window;
		if (ethereum) {
			window.ethereum.request({ method: 'eth_requestAccounts' }).then(accs => {
				if (accs.length) {
					setAddress(accs[0])
					window.sessionStorage.setItem("connect", "1")
				}
			});
		}
	}

	const _callBySign = async (method, ...args) => {
		const { ethereum, Web3 } = window;
		const web3 = new Web3(ethereum);
		const Raffle = new web3.eth.Contract(Abi, contractAddress);
		const data = Raffle.methods[method](...args).encodeABI();
		const transaction = ({
			from: address,
			to: contractAddress,
			value: 0,
			data
		});
		return await ethereum.request({ method: 'eth_sendTransaction', params: [transaction] });
	}

	const _call = async (method, ...args) => {
		const { ethereum, Web3 } = window;
		const web3 = new Web3(ethereum);
		const Raffle = new web3.eth.Contract(Abi, contractAddress);
		return await Raffle.methods[method](...args).call();
	}

	const getResult = async () => {
		setAgreeloading(true);
		const tx_id = await _callBySign("getResult");
		if (tx_id)
			console.log(tx_id)
	}
	const Disagree = async () => {
		setAgreeloading(true);
		const tx_id = await _callBySign("vote", vote_id, false);
		if (tx_id)
			setTxid(tx_id);
	}
	const onResult = async () => {
		// setLoading(true);
		const res = await _call("getSum", firstNum, secondNum);
		console.log(res);
		setResult(res);
	}

	return (
		<div className='Mainbody'>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<img className='Top_part' src={logoImg} alt="logo" width="100px" />
				<div style={{ margin: 20, display: 'flex', color: 'white', alignItems: 'center' }}>
					<button className='Metamask_connect' onClick={handleConnect} style={{ display: 'flex', alignItems: 'center', padding: '10px 30px' }}>
						<img src={metamaskicon} width={30} height={30} style={{ marginRight: 10 }} />
						{address ?
							<span>{address.slice(0, 5) + '...' + address.slice(-2)}</span> :
							<span>CONNECT</span>
						}
					</button>
				</div>
			</div>
			<div className='title'>
				Votting
			</div>
			<div className="section">
				<div className="panel">

					<div className='ID_input' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 50, paddingTop: 50 }}>
						First:
						<input type='text' onChange={event => setVoteID(event.target.value)} className='Input' style={{ marginLeft: 30 }} />
						<button className='Medium_button' onClick={getResult} style={{ padding: '10px 200px', width: '100%' }}>
							get Result
						</button>
					</div>

					<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 50 }}>
						<input type='text' onChange={event => setfirstNum(event.target.value)} className='Input' style={{ marginLeft: 30 }} />

						<input type='text' onChange={event => setsecondNum(event.target.value)} className='Input' style={{ marginLeft: 30 }} />
					</div>

					<div>
						<button className='Medium_button' onClick={onResult} style={{ padding: '10px 200px', width: '100%' }}>
							Get Sum
						</button>
					</div>

				</div>

			</div>

		</div>
	);
}
