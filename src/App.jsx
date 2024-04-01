import { useRef, useState ,useEffect,useCallback} from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import {sortPlacesByDistance} from "./loc.js";
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';


localStorage.clear();

let storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  let storedPlaces = storedIds.map((id) => {
    return(
      AVAILABLE_PLACES.find((place) => {
        return place.id === id
      })
    );
  });

function App() {

  const selectedPlace = useRef();
  let [modalIsOpen,setModalIsOpen] = useState(false); 
  let [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) =>{
      let sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES,location.coords.latitude,location.coords.longitude);          
      setAvailablePlaces(() => {
        return sortedPlaces;
      });      
    });
  },[]);
  

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    let storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if(storedIds.indexOf(id) === -1){
      localStorage.setItem("selectedPlaces",JSON.stringify([id,...storedIds]));
    }
    
  }

  
  let handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    let storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem("selectedPlaces",JSON.stringify(storedIds.filter((id) => {
      return id !== selectedPlace.current
    })));
  },[]);
  

  return (
    <>      
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Travel to your favourite places around the world by adding them to your bucket list
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
          loading = {false}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText = "Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
          loading = {true}
        />
      </main>
    </>
  );
}

export default App;
