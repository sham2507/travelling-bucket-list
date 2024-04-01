import {useEffect,useState} from "react";


export default function ProgressBar({timer}){
    let [remainingTime,setRemainingTime] = useState(timer);
    useEffect(() =>{
        let timer = setInterval(() =>{      
          setRemainingTime((prevTime) => {
            return prevTime-10; 
          });    
        },10);
    
        return () => {
          clearInterval(timer);
        }
      },[]);

      return(<progress value={remainingTime} max={timer}/>);    
}