import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="bg-blue-500 w-full h-[700px] max-md:h-[750px] max-lg:h-[900px]">
      <div className="justify-items-center items-center gap-x-10 max-lg:gap-y-10 grid grid-cols-3 max-lg:grid-cols-1 mx-auto px-10 max-lg:py-10 max-w-screen-2xl h-full">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="mb-3 font-bold text-white max-sm:text-3xl max-md:text-4xl max-xl:text-5xl text-6xl">
            THE PRODUCT OF THE FUTURE
          </h1>
          <p className="text-white max-sm:text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor modi
            iure laudantium necessitatibus ab, voluptates vitae ullam. Officia
            ipsam iusto beatae nesciunt, consequatur deserunt minima maiores
            earum obcaecati. Optio, nam!
          </p>
          <div className="flex max-lg:flex-col gap-x-1 max-lg:gap-y-1">
            <button className="bg-white hover:bg-gray-100 px-12 py-3 font-bold text-blue-600 max-sm:text-lg max-lg:text-xl">
              BUY NOW
            </button>
            <button className="bg-white hover:bg-gray-100 px-12 py-3 font-bold text-blue-600 max-sm:text-lg max-lg:text-xl">
              LEARN MORE
            </button>
          </div>
        </div>
        <Image
          src="/watch for banner.png"
          width={400}
          height={400}
          alt="smart watch"
          className="w-auto max-sm:w-[250px] max-md:w-[300px] h-auto max-sm:h-[250px] max-md:h-[300px]"
        />
      </div>
    </div>
  );
};

export default Hero;
