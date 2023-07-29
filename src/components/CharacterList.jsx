import React, { useState, useEffect} from "react";
import axios from 'axios';
import Modal from 'react-modal';

import CharacterCard from "./CharacterCard";
import ButtonUp from "./ButtonUp";
import Loader from "./Loader";


Modal.setAppElement("#root");

const CharacterList = ()=>{

    const[characters, setCharacters]= useState([]);
    const[currentPage, setCurrentPage]= useState(1);
    const[fetching, setFetching]= useState(true);
    const[selectedCard, setSelectedCard]= useState(null);
    const[episodeInfo, setEpisodeInfo]= useState(null);
    
    const fetchCharacters= async () => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${currentPage}`);
            setCharacters([...characters, ...response.data.results ]);
            setCurrentPage( prevState => prevState +1);
            
        } catch (error) {
            console.error('Error fetching characters:', error);
        } finally {
            setFetching(false);
        }
    };

    const fetchEpisodeInfo= async (episodeId) => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/episode/${episodeId}`);
            setEpisodeInfo(response.data);
        } catch (error) {
            console.error('Error fetching episode info:', error);
            setEpisodeInfo(null);
        }
    };

    
    useEffect( ()=>{

        if(fetching) {
            fetchCharacters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[fetching, currentPage ]);


    const scrollHandler =(e)=>{

        if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setFetching(true);
        }
    };


    useEffect( ()=>{

        document.addEventListener('scroll', scrollHandler)

        return function () {
            document.removeEventListener('scroll', scrollHandler)
        };

    },[]);

    const handleCardClick = async (character) => {
        setSelectedCard(character);

        try{
            await fetchEpisodeInfo(character.episode[0].split('/').slice(-1)[0]);
        } catch (error) {
            console.log('Error fetching episode info:', error);
            setEpisodeInfo(null);
        }
        
    };

    const closeModal = () => {
        setSelectedCard(null);
        setEpisodeInfo(null);
    };


    return ( <div className="character_list">

                {fetching && <Loader/>}
                <ButtonUp></ButtonUp>

                {characters.map ((character) => (
                    <CharacterCard key={character.id} character={character} onClick={ ()=> handleCardClick(character)}/>
                ))}

                <Modal 
                    isOpen={!!selectedCard}
                    onRequestClose={closeModal}
                    contentLabel="Character Modal"
                    style={{
                        overlay: {
                            backgroundColor: "#2b2a2ac4",
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "5%",
                        },
                        content: {
                            width: "fit-content",
                            height: "fit-content",
                            inset: "auto",
                            padding: "12px",
                        }
                    }}
                >
                    {selectedCard && (
                        <div >
                            <div className="modal">
                                <div className="img_modal">
                                    <img src={selectedCard.image} alt={selectedCard.name} title={selectedCard.name}/>
                                </div>
                                <div className="second">
                                    <div><p className="point">Name:</p><p>{selectedCard.name}</p></div>
                                    <div><p className="point">Status:</p><p>{selectedCard.status}</p></div>
                                    <div><p className="point">Species:</p><p>{selectedCard.species}</p></div>
                                </div>
                                <div className="third">
                                    <div><p className="point">Origin:</p><p>{selectedCard.origin.name}</p></div>
                                    <div><p className="point">Location:</p><p>{selectedCard.location.name}</p></div>
                                    <div><p className="point">Gender:</p><p>{selectedCard.gender}</p></div>
                                </div>

                                {episodeInfo && (
                                    <div className="fourth">
                                        <div><p className="point">Episode:</p><p>{episodeInfo.name}</p></div>
                                        <div><p className="point">Number:</p><p>{episodeInfo.episode}</p></div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="btn_close"><button onClick={closeModal}>Close</button></div>
                        </div>
                    )}
                </Modal>

            </div>
          )

};

export default CharacterList;