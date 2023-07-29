import React from "react";

const CharacterCard = ( {character, onClick})=>{

    return (
        <div className="character_card" onClick={onClick}>
            <img className="avatar" src={character.image} alt={character.name} title={character.name}/>
            <p className="name">{character.name}</p>
        </div>
    )

};

export default CharacterCard;