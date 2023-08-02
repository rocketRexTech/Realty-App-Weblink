import React from "react";
import close from '../assets/close.svg';




const HomeCard = (props, togglePop) => {
    const {name, address, description, image, attributes} = props.item


   console.log(props.item);

    return (

        <div className='home__details'>

            <div className='home__image'>
                <img src={image} alt="Home" />
            </div>

            <div className='home__overview'>
                <h1>{name}</h1>
                <p>
                    <strong>{attributes[0].value}</strong> bds |
                    <strong>{attributes[1].value}</strong> ba |
                    <strong>{attributes[2].value}</strong> sqft
                </p>
                <p>{address}</p>
                <h2>{attributes[0].value} ETH</h2>

                <button className="home__buy">
                    Buy
                </button>

                <hr />

                <h2>Overview</h2>
                <p>
                    {description}
                </p>

                <h2>Facts & Features</h2>
                <ul>
                    {attributes.map((attribute, index) => (
                        <li key='index'><strong>{attribute.trait_type}</strong>: {attribute.value}</li>
                    ))}
                </ul>

            </div>


            <button onClick={() => props.togglePop()} className='home__close'>
                <img src={close} alt="Close" />
            </button>
        </div>


    )
}

export default HomeCard