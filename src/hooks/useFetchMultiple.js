import { useState, useEffect } from "react";
import {API_KEY} from '../config/config.js';
import { TravelDataContext } from "../context/TravelDataContext.js";
import { useContext } from "react";

console.log(API_KEY);

export const useFetchMultiple = (travelData, method = "GET") => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);

  const postData = (postData) => {
    setOptions({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const getJSON = function (url,controller ,errorMsg = 'Something went wrong') {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`${errorMsg} ${response.status}`);
      }
  
      return response.json();
    });
  };
  
  useEffect(() => {
    if(travelData === undefined) return
    // const controller = new AbortController();
console.log('INSIDE USE EFFECT');

    const from = travelData.from;
    const to = travelData.to;

    console.log(from,to);
    const fetchData = async (fetchOptions) => {
      setIsPending(true);

      try {
          let data = await Promise.all([
            getJSON(`https://api.flightapi.io/roundtrip/${API_KEY}/LHR/CDG/${from}/${to}/2/0/0/Economy/GBP`),
            // getJSON(`https://api.flightapi.io/roundtrip/${API_KEY}/LHR/MAD/${from}/${to}/2/0/0/Economy/GBP`),
            // getJSON(`https://cors-anywhere.herokuapp.com/https://api.flightapi.io/roundtrip/${API_KEY}/LHR/BER/${from}/${to}/2/0/0/Economy/GBP`),
        ])
        setIsPending(false);
        setData(data);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("the fetch was aborted");
        } else {
          setIsPending(false);
          setError("Could not fetch the data");
        }
      }
    };
    fetchData();
    // if (method === "GET" && options) {
    
    // }
    // if (method === "POST" && options) {
    //   fetchData(options);
    // }

    // return () => {
    //   controller.abort();
    // };
  }, [travelData, options, method]);

  return { data, isPending, error, postData };
};