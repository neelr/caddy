"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [qs, setQs] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.addEventListener('error', event => {
      event.stopImmediatePropagation()
    })
  
    window.addEventListener('unhandledrejection', event => {
      event.stopImmediatePropagation()
    })
  }, [])
  useEffect(() => {
    console.log(qs)
    if (qs.length % 4 == 0 && qs.length > 3) {
      fetch("http://localhost:8000/qs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: qs,
          k: 3,
      })
      })
        .then((res) => res.json())
        .then((data) => {
          setDocs(data);
        })
    }
    
  }, [qs]);
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
      style={{
        minHeight: "100vh",
      }}
    >
      <nav class="transparent" style={{
        position: "fixed",
        zIndex: 1,
      }}>
  <div class="mx-auto max-w px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <a href="/" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium active:bg-gray-900">Home</a>
            <a href="/graph" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Knowledge Graph</a>
            <a href="/recs" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Recs</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
      <div
        className="pattern-dots pattern-pink-400 pattern-bg-black
        pattern-size-6 pattern-opacity-40"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -1,
        }}
      ></div>
      <h1 className=" text-5xl font-bold tracking-tight sm:text-5xl text-white-600 mt-24">
        Caddy
      </h1>
      <h5 className="text-2xl font-bold tracking-tight sm:text-2sm text-white-600">
        the research assistant of all time.
      </h5>
      <form className="mt-8 w-full max-w-md mb-auto" action="javascript:void(0);" method="POST">
        <label
          for="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Quickly search for anything..."
            onChange={(e) => {
              setQuestion(null);
              setQs(e.target.value);
            }}
            required
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={(e) => {
             setLoading(true);
              setDocs([]);
              fetch("http://localhost:8000/question", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  q: qs,
                  k: 3,
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  setQuestion(
                    <>
                    {data.data}
                    <br/>
                    <br/>
                    <br/>
                    Sources:
                    <br/>
                    {data.docs.map((doc) => <><a href={doc.url} className="text-1md font-bold tracking-tight sm:text-1sm text-blue-600">
                      {doc.title}
                      </a><br/> <br/></>)}
                    </>
                  );
                  setLoading(false);
                });
            }
            }
          >
            or ask a question!
          </button>
        </div>
        {/*-- non interactable text area --*/}
        <div
          id="text"
          className="mt-10 block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          readOnly
        >
          {question ?? docs.map((doc) => {
            return (
              <div className="mt-10 block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex flex-row">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-2sm text-white-600">
                    {doc.title}
                  </h1>
                  <a href={doc.url} className="text-1md font-bold tracking-tight sm:text-1sm text-blue-600">
                    check out the link!
                  </a>
                </div>
              </div>
            );
          })}
          <p className="loading text-1md font-bold tracking-tight text-white-600" style={{
            display: loading ? "inline-block" : "none"
          }}>Loading...</p>
        </div>
        
      </form>
    </main>
  );
}
