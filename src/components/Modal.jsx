import {useRef,useEffect} from 'react';
import { createPortal } from 'react-dom';


function Modal({ open,children }) {
  
  let dialog = useRef();

  useEffect(() => {
    if(open){
      dialog.current.showModal();
    }  
    else{
      dialog.current.close();
    }
  },[open]);
  
  
  return createPortal(
    <dialog ref={dialog} className="modal">
      {open && children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
