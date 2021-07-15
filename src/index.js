import React, { Component, useState, useEffect } from "react";
import $ from "jquery";
import "./carddeck.scss";

export default function InfCardDeck(props) {
  var clicked = false;
  var touched = false;
  var swipeDirectionTmp = null;
  // var animating = false;
  const moveHorizontalThreshold = 0.33;
  const moveVerticalThreshold = 0.15;
  var prevMousePosition = [0, 0];
  var xMoveAmountTmp = 0;
  var yMoveAmountTmp = 0;
  const [xMoveAmount, setXMoveAmount] = useState(0);
  const [yMoveAmount, setYMoveAmount] = useState(0);
  const [floating, setFloating] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const swipesEnabled = props.swipesEnabled || ["up", "down", "left", "right"];
  const notifyThreshold =
    props.notifyThreshold || props.notifyThreshold === 0
      ? props.notifyThreshold
      : 4;

  const renderCard = (card, index) => {
    var childProps = { card, index, swipeDirection, currentCardIndex };
    if (props.renderCard) {
      return props.renderCard(childProps);
    } else {
      return DefaultCard(childProps);
    }
  };

  const cards = props.cards.map((card, index) => {
    return renderCard(card, index);
  });

  const setXMoveAmountAll = (value) => {
    setXMoveAmount(value);
    xMoveAmountTmp = value;
  };

  const setYMoveAmountAll = (value) => {
    setYMoveAmount(value);
    yMoveAmountTmp = value;
  };

  const setSwipeDirectionAll = (direction) => {
    swipeDirectionTmp = direction;
    setSwipeDirection(direction);
  };

  const onSwipeStart = () => {
    if (props.onSwipeStart) {
      props.onSwipeStart(currentCardIndex);
    }
  };
  const onSwipeLeftStart = () => {
    if (swipesEnabled.indexOf("left") !== -1) {
      setSwipeDirectionAll("left");
      if (props.onSwipeLeftStart) {
        props.onSwipeLeftStart(currentCardIndex);
      }
    }
  };
  const onSwipeRightStart = () => {
    if (swipesEnabled.indexOf("right") !== -1) {
      setSwipeDirectionAll("right");
      if (props.onSwipeRightStart) {
        props.onSwipeRightStart(currentCardIndex);
      }
    }
  };
  const onSwipeUpStart = () => {
    if (swipesEnabled.indexOf("up") !== -1) {
      setSwipeDirectionAll("up");
      if (props.onSwipeUpStart) {
        props.onSwipeUpStart(currentCardIndex);
      }
    }
  };
  const onSwipeDownStart = () => {
    if (swipesEnabled.indexOf("down") !== -1) {
      setSwipeDirectionAll("down");
      if (props.onSwipeDownStart) {
        props.onSwipeDownStart(currentCardIndex);
      }
    }
  };

  const onSwiped = () => {
    if (swipesEnabled.indexOf(swipeDirectionTmp) !== -1) {
      if (props.onSwiped) {
        props.onSwiped(currentCardIndex);
      }
      if (swipeDirectionTmp === "up") {
        onSwipedUp();
      } else if (swipeDirectionTmp === "down") {
        onSwipedDown();
      } else if (swipeDirectionTmp === "left") {
        onSwipedLeft();
      } else if (swipeDirectionTmp === "right") {
        onSwipedRight();
      }

      var remainingCards = props.cards.length - currentCardIndex - 1; //One card will be hidden now so - 1
      if (props.notifyToReload && notifyThreshold >= remainingCards) {
        props.notifyToReload();
      }
      setCurrentCardIndex(currentCardIndex + 1);
      setFloating(false);
    }
  };
  const onSwipedLeft = () => {
    if (props.onSwipedLeft) {
      props.onSwipedLeft(currentCardIndex);
    }
  };
  const onSwipedRight = () => {
    if (props.onSwipedRight) {
      props.onSwipedRight(currentCardIndex);
    }
  };
  const onSwipedUp = () => {
    if (props.onSwipedUp) {
      props.onSwipedUp(currentCardIndex);
    }
  };
  const onSwipedDown = () => {
    if (props.onSwipedDown) {
      props.onSwipedDown(currentCardIndex);
    }
  };

  const doSwipeAction = () => {
    setAnimating(true);
    touched = clicked = false;
    if (swipeDirectionTmp) {
      setXMoveAmountAll(xMoveAmountTmp * 3);
      setYMoveAmountAll(yMoveAmountTmp * 3);
      window.setTimeout(() => {
        onSwiped();
        setXMoveAmountAll(0);
        setYMoveAmountAll(0);
        setSwipeDirectionAll(null);
        setAnimating(false);
      }, 300);
    } else {
      setXMoveAmountAll(0);
      setYMoveAmountAll(0);
      setSwipeDirectionAll(null);
      window.setTimeout(() => {
        setAnimating(false);
      }, 300);
    }
    setFloating(false);
  };

  const cancelSwipeDirection = () => {
    setSwipeDirectionAll(null);
  };

  useEffect(() => {
    setCurrentCardIndex(0);
  }, [props.cards[0]]);

  useEffect(() => {
    $(".carddeck").off(
      "touchstart mousedown touchend mouseup mouseleave touchmove mousemove"
    );
    $(".carddeck").on("touchstart", ".card0", (e) => {
      handleMouseDown(e.touches[0], "touch");
    });
    $(".carddeck").on("mousedown", ".card0", (e) => {
      handleMouseDown(e, "click");
    });

    $(".carddeck").on("touchend", (e) => {
      handleMouseUp(e.changedTouches[0]);
    });
    $(".carddeck").on("mouseup", (e) => {
      handleMouseUp(e);
    });

    $(".carddeck").on("mouseleave", ".card0", (e) => {
      handleMouseLeave(e);
    });

    $(".carddeck").on("touchmove", ".card0", (e) => {
      handleMouseMove(e);
    });
    $(".carddeck").on("mousemove", ".card0", (e) => {
      handleMouseMove(e);
    });
  }, [props.cards, currentCardIndex]);

  const handleMouseLeave = (e) => {
    // console.log("Leave:" + e.clientX + ":" + e.clientY);
    doSwipeAction();
    $("html,body").removeClass("fixed");
  };

  const handleMouseUp = (e) => {
    doSwipeAction();
    $("html,body").removeClass("fixed");
  };

  const handleMouseDown = (e, type) => {
    if (type == "touch") {
      touched = true;
    } else {
      clicked = true;
    }
    setFloating(true);
    $("html,body").addClass("fixed");
    prevMousePosition = [e.clientX, e.clientY];

    // console.log("Click:" + e.clientX + ":" + e.clientY);
  };

  const handleMouseMove = (event) => {
    try {
      if (clicked || touched) {
        if (clicked) {
          var e = event;
        } else if (touched) {
          var e = event.changedTouches[0];
        }

        var xMoveAmount = e.clientX - prevMousePosition[0];
        var yMoveAmount = e.clientY - prevMousePosition[1];
        setXMoveAmountAll(xMoveAmount);
        setYMoveAmountAll(yMoveAmount);
        // console.log("Moved:" + e.clientX + ":" + e.clientY);
        // console.log(
        //   "xMoveAmount:" + xMoveAmount + " yMoveAmount:" + yMoveAmount
        // );
        var width = $(".carddeck").width();
        var height = $(".carddeck").height();
        var moved = false;
        if (Math.abs(xMoveAmount) > 3 || Math.abs(yMoveAmount) > 3) {
          onSwipeStart();
        }
        if (
          Math.abs(xMoveAmount) > width * moveHorizontalThreshold ||
          Math.abs(yMoveAmount) > height * moveVerticalThreshold
        ) {
          if (Math.abs(xMoveAmount) > width * moveHorizontalThreshold) {
            if (xMoveAmount < 0) {
              onSwipeLeftStart();
            } else {
              onSwipeRightStart();
            }
          } else if (Math.abs(yMoveAmount) > height * moveVerticalThreshold) {
            if (yMoveAmount < 0) {
              onSwipeUpStart();
            } else {
              onSwipeDownStart();
            }
          }
        } else {
          cancelSwipeDirection();
        }
      }
    } catch (ex) {}
  };

  return (
    <React.Fragment>
      <div className="carddeck">
        {cards.map((card, index) => (
          <div
            key={index}
            className={
              "card " +
              ("card" + (index - currentCardIndex)) +
              (floating && index === currentCardIndex ? " floating " : "") +
              (animating && index === currentCardIndex ? " animating " : "") +
              (currentCardIndex > index ? " hidden " : " visible ")
            }
            style={
              (floating || animating) && index === currentCardIndex
                ? {
                    marginLeft: xMoveAmount,
                    marginTop: yMoveAmount,
                    transform: "rotate(" + Math.ceil(xMoveAmount / 20) + "deg)",
                  }
                : {}
            }
          >
            {card}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

function DefaultCard({ card, index, swipeDirection, currentCardIndex }) {
  const cardColor = () => {
    let colors = ["red", "green", "blue", "yellow", "gray", "cyan", "magenta"];
    return colors[index % colors.length];
  };

  return (
    <React.Fragment>
      <div
        className="cardimg"
        style={{
          background: cardColor(),
          fontSize: 30,
          textAlign: "center",
          paddingTop: "48%",
        }}
      >
        Card {index}
      </div>
    </React.Fragment>
  );
}
