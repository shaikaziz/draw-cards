import React, { Component } from 'react'
import axios from 'axios'
import Card from './Card'
import './Deck.css'

const apiBase = "https://deckofcardsapi.com/api/deck"

export default class Deck extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             deck: null,
             drawn: []
        }
        this.getCard = this.getCard.bind(this)
    }

    async componentDidMount() {
        let deck = await axios.get(`${apiBase}/new/shuffle/`, {
            params: {joker: 0}
        });
        this.setState({ deck: deck.data });
      }

    async getCard() {
        let deck_id = this.state.deck.deck_id;
        

        try {
            let cardUrl = `${apiBase}/${deck_id}/draw/`;
            let cardRes = await axios.get(cardUrl);
            if(cardRes.data.remaining === 0) {
                throw new Error("Zero cards remaining. ")
            }
            console.log(cardRes.data);
            let cardInfo = cardRes.data.cards[0];
            this.setState(st => ({
                drawn: [
                    ...st.drawn,
                    {
                        id: cardInfo.code,
                        image: cardInfo.image,
                        name: `${cardInfo.value} of ${cardInfo.suit} `
                    }

                 ]
            }))
        } catch(err) {
            alert(err)
        }
    }

    render() {
        const cards = this.state.drawn.map(c => (
            <Card name={c.name} image={c.image} />
        ))
        return (
            <div>
                <h1 className="Deck-head">Draw Cards!</h1>
                <h2 className="Deck-head subtitle">A React app that draws card</h2>
                <button className="Deck-button" onClick={this.getCard} >Get Card</button>
                <div className="Deck-card-area">
                    {cards} 
                </div>
               
            </div>
        )
    }
}
