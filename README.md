# Tinder like card deck for react js

This is the alpha version. Detailed documentation and more customization options will be added eventually.

#How to use

<InfCardDeck
  cards={arrayOfCardObjects}
  renderCard={CustomCardComponent}
  onSwipeStart={onSwipeStart}
  onSwipedLeftStart={onSwipedLeftStart}
  onSwipedRightStart={onSwipedRightStart}
  onSwipedUpStart={onSwipedUpStart}
  onSwipedDownStart={onSwipedDownStart}
  onSwipedLeft={onSwipedLeft}
  onSwipedRight={onSwipedRight}
  onSwipedUp={onSwipedUp}
  onSwipedDown={onSwipedDown}
  onSwiped={onSwiped}
  swipesEnabled={["up", "left", "right", "down"]}
  notifyToReload={loadMoreGames}
  notifyThreshold={2}
/>
