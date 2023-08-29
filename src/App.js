import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  return <BillSplit></BillSplit>;
}

function BillSplit() {
  const [newItems, setNewItems] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddNewItem(item) {
    setNewItems((items) => [...items, item]);
  }

  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setNewItems((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="column">
          <Friends
            newItems={newItems}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          ></Friends>
        </div>
        <div className="column">
          <AddFriends onHandleAddNewItem={handleAddNewItem}></AddFriends>
        </div>
      </div>
      <div className="row">
        <div className="column">
          {selectedFriend && (
            <Bill
              selectedFriend={selectedFriend}
              onSplitBill={handleSplitBill}
            ></Bill>
          )}
        </div>
      </div>
    </div>
  );
}

function Friends({ newItems, onSelection, selectedFriend }) {
  return (
    <ul>
      {newItems.map((items) => (
        <IndividualFriend
          currItems={items}
          key={items.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        ></IndividualFriend>
      ))}
    </ul>
  );
}

function IndividualFriend({ currItems, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === currItems.id;
  // console.log(isSelected);
  return (
    <li className="flex">
      <img src={currItems.image} alt="friend"></img>
      <div>
        <h4>{currItems.name}</h4>
        {currItems.balance > 0 ? (
          <p style={{ color: "green" }}>
            {currItems.name} owes me ${currItems.balance}
          </p>
        ) : currItems.balance === 0 ? (
          <p>You and {currItems.name} are even</p>
        ) : (
          <p style={{ color: "red" }}>
            You owe {currItems.name} ${currItems.balance}
          </p>
        )}
      </div>
      <button onClick={() => onSelection(currItems)} className="btn">
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function AddFriends({ onHandleAddNewItem }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(!isOpen);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const addNewItem = { id: Date.now(), name: name, image: image, balance: 0 };
    onHandleAddNewItem(addNewItem);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <div>
      {isOpen ? (
        <div>
          <form className="form-container-2" onSubmit={handleSubmit}>
            <div className="form-box-2">
              <label>Friend name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              ></input>
            </div>
            <div className="form-box-2">
              <label>Image URL</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                type="text"
              ></input>
            </div>
            <button className="btn">Add</button>
          </form>
          <button className="btn" onClick={handleOpen}>
            Close
          </button>
        </div>
      ) : (
        <button className="btn" onClick={handleOpen}>
          Add Friend
        </button>
      )}
    </div>
  );
}

function Bill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [myBill, setMyBill] = useState(0);
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendExpense = bill - myBill;

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myBill) return;
    onSplitBill(whoIsPaying === "user" ? friendExpense : -myBill);
  }
  return (
    <div className="form-container" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFriend.name}</h2>
      <form>
        <div className="form-box">
          <label>Bill Value</label>
          <input
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            type="number"
          ></input>
        </div>
        <div className="form-box">
          <label>Your Expense</label>
          <input
            value={myBill}
            type="number"
            onChange={(e) =>
              setMyBill(
                Number(e.target.value) > bill ? myBill : Number(e.target.value)
              )
            }
          ></input>
        </div>
        <div className="form-box">
          <label>{selectedFriend.name} Expense</label>
          <input type="number" value={friendExpense}></input>
        </div>
        <div className="form-box">
          <label>Who is paying the bill?</label>
          <select
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          >
            <option value="user">You</option>
            <option value="Friend">{selectedFriend.name}</option>
          </select>
        </div>
        <button className="btn">Split bill</button>
      </form>
    </div>
  );
}

export default App;
