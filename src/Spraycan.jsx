import React from "react";
import { css } from "@stitches/react";

const Spraycan = ({ canColor, handColor }) => {
  const canStyle = css({
    // backgroundColor: canColor,
    //Need to figure out method to separate hand and can
    // Separate SVG into hand and can, put them in the same div and color them differently using filter.
    // Will need to position them inside the div precisely - transform or flexbox
    // filter:
    //   "invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)",
    height: "100px",
    width: "100px",
    backgroundColor: "red",
    maskSize: "contain",
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskImage: 'url("img/sprayCanHand.svg")',
    // backgroundImage: 'url("img/sprayCanHand.svg")',
  });

  return (
    <>
      <div className={canStyle()}></div>

      {/* <img className={canStyle()} src={"img/sprayCanHand.svg"} alt="" /> */}
    </>
  );
};

export default Spraycan;
