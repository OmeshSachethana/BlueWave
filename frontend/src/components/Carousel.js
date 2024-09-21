import React from "react";
import drinkingwater1 from "../assets/drinkingwater1.jpg";
import drinkingwater2 from "../assets/drinkingwater2.png";
import drinkingwater3 from "../assets/drinkingwater3.jpg";

const Carousel = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Work+Sans:200,400&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .work-sans {
              font-family: 'Work Sans', sans-serif;
          }
              
          #menu-toggle:checked + #menu {
              display: block;
          }
          
          .hover\\:grow {
              transition: all 0.3s;
              transform: scale(1);
          }
          
          .hover\\:grow:hover {
              transform: scale(1.02);
          }
          
          .carousel-open:checked + .carousel-item {
              position: static;
              opacity: 100;
          }
          
          .carousel-item {
              transition: opacity 0.6s ease-out;
          }
          
          #carousel-1:checked ~ .control-1,
          #carousel-2:checked ~ .control-2,
          #carousel-3:checked ~ .control-3 {
              display: block;
          }
          
          .carousel-indicators {
              list-style: none;
              margin: 0;
              padding: 0;
              position: absolute;
              bottom: 2%;
              left: 0;
              right: 0;
              text-align: center;
              z-index: 10;
          }
          
          #carousel-1:checked ~ .control-1 ~ .carousel-indicators li:nth-child(1) .carousel-bullet,
          #carousel-2:checked ~ .control-2 ~ .carousel-indicators li:nth-child(2) .carousel-bullet,
          #carousel-3:checked ~ .control-3 ~ .carousel-indicators li:nth-child(3) .carousel-bullet {
              color: #000;
          }
      `,
        }}
      />
      <div
        className="carousel relative container mx-auto"
        style={{ maxWidth: 1600 }}
      >
        <div className="carousel-inner relative overflow-hidden w-full">
          {/* Slide 1 */}
          <input
            className="carousel-open hidden"
            type="radio"
            id="carousel-1"
            name="carousel"
            aria-hidden="true"
            hidden=""
            defaultChecked="checked"
          />
          <div
            className="carousel-item absolute opacity-0"
            style={{ height: "50vh" }}
          >
            <div
              className="block h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-right"
              style={{
                backgroundImage: `url(${drinkingwater1})`, // Using imported image
              }}
            >
              <div className="container mx-auto">
                <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                  <p className="text-black text-2xl my-4">
                    "Water is the essence of life."
                  </p>
                </div>
              </div>
            </div>
          </div>
          <label
            htmlFor="carousel-3"
            className="prev control-1 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 left-0 my-auto"
          >
            ‹
          </label>
          <label
            htmlFor="carousel-2"
            className="next control-1 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 right-0 my-auto"
          >
            ›
          </label>
          {/* Slide 2 */}
          <input
            className="carousel-open hidden"
            type="radio"
            id="carousel-2"
            name="carousel"
            aria-hidden="true"
            hidden=""
          />
          <div
            className="carousel-item absolute opacity-0"
            style={{ height: "50vh" }}
          >
            <div
              className="block h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-right"
              style={{
                backgroundImage: `url(${drinkingwater2})`, // Using imported image
              }}
            >
              <div className="container mx-auto">
                <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                  <p className="text-black text-2xl my-4">
                    "Stay hydrated, stay healthy."
                  </p>
                </div>
              </div>
            </div>
          </div>
          <label
            htmlFor="carousel-1"
            className="prev control-2 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 left-0 my-auto"
          >
            ‹
          </label>
          <label
            htmlFor="carousel-3"
            className="next control-2 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 right-0 my-auto"
          >
            ›
          </label>
          {/* Slide 3 */}
          <input
            className="carousel-open hidden"
            type="radio"
            id="carousel-3"
            name="carousel"
            aria-hidden="true"
            hidden=""
          />
          <div
            className="carousel-item absolute opacity-0"
            style={{ height: "50vh" }}
          >
            <div
              className="block h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-right"
              style={{
                backgroundImage: `url(${drinkingwater3})`, // Using imported image
              }}
            >
              <div className="container mx-auto">
                <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                  <p className="text-black text-2xl my-4">
                    "Drink water, live better."
                  </p>
                </div>
              </div>
            </div>
          </div>
          <label
            htmlFor="carousel-2"
            className="prev control-3 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 left-0 my-auto"
          >
            ‹
          </label>
          <label
            htmlFor="carousel-1"
            className="next control-3 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 right-0 my-auto"
          >
            ›
          </label>
          {/* Indicators */}
          <ol className="carousel-indicators">
            <li className="inline-block mr-3">
              <label
                htmlFor="carousel-1"
                className="carousel-bullet cursor-pointer block text-4xl text-gray-400 hover:text-gray-900"
              >
                •
              </label>
            </li>
            <li className="inline-block mr-3">
              <label
                htmlFor="carousel-2"
                className="carousel-bullet cursor-pointer block text-4xl text-gray-400 hover:text-gray-900"
              >
                •
              </label>
            </li>
            <li className="inline-block mr-3">
              <label
                htmlFor="carousel-3"
                className="carousel-bullet cursor-pointer block text-4xl text-gray-400 hover:text-gray-900"
              >
                •
              </label>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Carousel;
