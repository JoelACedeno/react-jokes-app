import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numJokesToGet = 5 }) => {
	const [jokes, setJokes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);


	/** if there are no jokes get new jokes */
	useEffect(function () {
		async function getJokes() {
			let j = [...jokes];
			let seenJokes = new Set();

			try {
				while (j.length < numJokesToGet) {
					let res = await axios.get("https://icanhazdadjoke.com", {
						headers: { Accept: "application/json" }
					});
					let { ...jokeObj } = res.data;

					if (!seenJokes.has(jokeObj.id)) {
						seenJokes.add(jokeObj.id);
						j.push({ ...jokeObj, votes: 0 });
					} else {
						console.log("duplicate found!");
					}
				}

				setJokes(j);
				setIsLoading(false);

			} catch (err) {
				console.error(err);
			}
		}
		if (jokes.length === 0) getJokes();
	}, [jokes, numJokesToGet]);


	/** empty joke list and get new jokes */
	function generateNewJokes() {
		setJokes([]);
		setIsLoading(true);
	}

	/** change joke vote by delta (+1 or -1) */
	function vote(id, delta) {
		setJokes(allJokes =>
			allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
		);
	}


	/** render spinner if loading or list of sorted jokes */

	if (isLoading) {
		return (
			<div className="loading">
				<i className="fas fa-4x fa-spinner fa-spin" />
			</div>
		)
	}

	let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

	return (
		<div className="JokeList">
			<button
				className="JokeList-getmore"
				onClick={generateNewJokes}
			>
				Get New Jokes
			</button>

			{sortedJokes.map(({ joke, id, votes }) => (
				<Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
			))}
		</div>
	);
}


export default JokeList;
