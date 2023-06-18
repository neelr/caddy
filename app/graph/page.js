"use client";
import { useEffect, useRef, useState } from "react";
import embeds from "../../public/x_embeds.json";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const handleWheel = (event) => {
      event.preventDefault();

      const { clientX, clientY, deltaY } = event;
      const rect = canvas.getBoundingClientRect();
      const dx = (clientX - rect.left - offset.x) / scale;
      const dy = (clientY - rect.top - offset.y) / scale;
      const newScale = Math.max(0.1, scale - deltaY * 0.001);
      const newOffsetX = clientX - rect.left - dx * newScale;
      const newOffsetY = clientY - rect.top - dy * newScale;

      setScale(newScale);
      setOffset({ x: newOffsetX, y: newOffsetY });
    };

    const handleMouseDown = (event) => {
      setDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
        // click on A tag
        if (url != "")
        document.getElementById("clicker").click();
    };

    const handleMouseMove = (event) => {
        Object.keys(embeds).forEach((key) => {
            const circle = new Path2D();
            circle.arc(
              embeds[key][1][0] * 5*(scale**3) + canvas.width / 2,
              embeds[key][1][1] * 5*(scale**3) + canvas.height / 2,
              8,
              0,
              2 * Math.PI
            );
            if (context.isPointInPath(circle, event.offsetX, event.offsetY)) {
                context.fillStyle = "green";
                setUrl(key);
                setTitle(embeds[key][0])

              } else {
                if (url == key)
                setUrl("")
                context.fillStyle = "red";
              }
            context.fill(circle);
          });

      if (!dragging) return;

      const offsetX = event.clientX - dragStart.x;
      const offsetY = event.clientY - dragStart.y;

      setOffset((prevOffset) => ({
        x: prevOffset.x + offsetX,
        y: prevOffset.y + offsetY,
      }));

      setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    //onclick

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [offset, scale, dragging, dragStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "black";
    console.log(scale, offset);
    context.clearRect(
      -offset.x,
      -offset.y,
      (canvas.width + Math.abs(offset.x)) * (1 / scale),
      (canvas.height + Math.abs(offset.y)) * (1 / scale)
    );

    // Clear canvas
    Object.keys(embeds).forEach((key) => {
        const circle = new Path2D();
        circle.arc(
              embeds[key][1][0] * 5*(scale**3) + canvas.width / 2,
              embeds[key][1][1] * 5*(scale**3) + canvas.height / 2,
              8,
              0,
              2 * Math.PI
            );
        if (false) {
            context.fillStyle = "green";
            setUrl(key);
            setTitle(embeds[key][0])

          } else {

            context.fillStyle = "red";
          }
        context.fill(circle);
      }); 

    // Background
    const drawGraphBackground = (ctx) => {
      ctx.beginPath();
      const dotDistance = 20;
      for (
        let x = -offset.x;
        x < (canvas.width - offset.x) * (1 / scale);
        x += dotDistance
      ) {
        for (
          let y = -offset.y;
          y < (canvas.height - offset.y) * (1 / scale);
          y += dotDistance
        ) {
          ctx.moveTo(x, y);
          ctx.arc(x, y, 1, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = "#ddd";
      ctx.fill();
    };

    // Transformations for zooming and panning
    drawGraphBackground(context);
    context.setTransform(scale, 0, 0, scale, offset.x, offset.y);

    // Drawing code here (after transformations)
    Object.keys(embeds).forEach((key) => {
        const circle = new Path2D();
        circle.arc(
          embeds[key][0] * 5 + canvas.width / 2,
          embeds[key][1] * 5 + canvas.height / 2,
          10,
          0,
          2 * Math.PI
        );
        if (true) {
            context.fillStyle = "green";
          } else {
            context.fillStyle = "red";
          }
        context.fill(circle);
      });
    
  }, [scale, offset]);

  return (
    <>
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        cursor: "crosshair"
      }}
    />
    <div style={{
            position: "fixed",
            zIndex: 1,
            width:"200px",
            height:"100px",
            bottom:"0%",
            left:"0%",
            backgroundColor:"rgba(0,0,0,0.5)",
            color:"white",
            padding:"10px",
            borderRadius:"10px",
            margin:"10px"
        }}>
        <p className="text-1md font-bold tracking-tight text-white-600">
            {title  ? title : "Hover over a node to see the url!"}
        </p>
        <a id="clicker" href={url} style={{display:"none"}} target="_blank">.</a>
        </div>
        <div style={{
            position: "fixed",
            zIndex: 1,
            width:"200px",
            height:"100px",
            top:"0%",
            left:"0%",
            backgroundColor:"rgba(0,0,0,0.5)",
            color:"white",
            padding:"10px",
            borderRadius:"10px",
            margin:"10px"
        }}>
        <p className="text-5xl font-bold tracking-tight text-white-600">
            The Knowledge Graph!
        </p>
        <a id="clicker" href={url} style={{display:"none"}} target="_blank">.</a>
        </div>
    </>
  );
};

const Home = () => {
    useEffect(() => {
        window.addEventListener('error', event => {
          event.stopImmediatePropagation()
        })
      
        window.addEventListener('unhandledrejection', event => {
          event.stopImmediatePropagation()
        })
      }, [])
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-between"
      style={{ height: "100vh", width: "100vw" }}
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
            <a href="/" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Home</a>
            <a href="/graph" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Knowledge Graph</a>
            <a href="/recs" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Recs</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
      <Canvas />

      
    </div>
  );
};

export default Home;
