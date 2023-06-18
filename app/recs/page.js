"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [docs, setDocs] = useState([]);
    useEffect(() => {
        window.addEventListener('error', event => {
          event.stopImmediatePropagation()
        })
      
        window.addEventListener('unhandledrejection', event => {
          event.stopImmediatePropagation()
        })
      }, [])
    useEffect(() => {
        fetch("http://localhost:8000/reccs")
            .then((res) => res.json())
            .then((data) => {
                setDocs(data);
            })
    }, []);
    return (
      <main className="flex min-h-screen flex-col items-center justify-between" style={{minHeight: "100vh"}}>
        <nav class="transparent" style={{
        position: "fixed",
        zIndex: 1,
      }}>
  <div class="mx-auto max-w px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <a href="/" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Home</a>
            <a href="/graph" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Knowledge Graph</a>
            <a href="/recs" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Recs</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
        <div className="pattern-dots pattern-blue-400 pattern-bg-black pattern-size-6 pattern-opacity-40" style={{width: "100%", height: "100vh"}}>
            <div className="flex flex-col items-center justify-center w-full h-full">
                <h1 className="text-5xl font-bold tracking-tight text-white-600">Recommendations</h1>
                <h5 className="text-2xl font-bold tracking-tight text-white-600">Get push notifications of new papers!</h5>
                <div className="items-center justify-center bg-white-900 rounded-lg shadow-lg m-2 p-2 w-1/2" style={{
                    backgroundColor: "white",
                }}>
                {
                    docs.length != 0 ? 
                    Object.keys(docs).map((doc) => {
                        return (
                            <div className="flex flex-col items-center justify-center bg-white-900 rounded-lg shadow-lg m-2 p-2">
                                    <a href={`https://arxiv.org/abs/${doc}`} className="text-1md font-bold tracking-tight text-blue-600 hover:text-blue-400">{docs[doc]}</a>
                            </div>
                        )
                    }) : <><p className="loading text-1md font-bold tracking-tight text-yellow-600" style={{
                        display: docs.length == 0 ? "inline-block" : "none",
                        color:"#fff !important",
                        textAlign:"center",
                      }}>Loading...</p></>
                }
                </div>
                </div>
        </div>
        </main>

    )
}