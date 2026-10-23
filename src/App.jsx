
import { useState } from "react";
import "./App.css";

const initialItems = ["Apple", "Banana", "Orange", "Mango", "Grapes"];

export default function App() {
  const [leftItems, setLeftItems] = useState(initialItems);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editSide, setEditSide] = useState("");

  // Add a new item
  function addItem(e) {
    e.preventDefault();

    const name = newItem.trim();

    if (!name) return;

    const exists = [...leftItems, ...rightItems].some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("This item already exists!");
      return;
    }

    setLeftItems((current) => [...current, name]);
    setNewItem("");
  }

  // Select or unselect an item
  function toggleItem(item, side) {
    const selected = side === "left" ? selectedLeft : selectedRight;
    const setSelected =
      side === "left" ? setSelectedLeft : setSelectedRight;

    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  }

  // Move selected items to the right
  function moveRight() {
    if (selectedLeft.length === 0) return;

    setRightItems((current) => [...current, ...selectedLeft]);
    setLeftItems((current) =>
      current.filter((item) => !selectedLeft.includes(item))
    );
    setSelectedLeft([]);
  }

  // Move selected items to the left
  function moveLeft() {
    if (selectedRight.length === 0) return;

    setLeftItems((current) => [...current, ...selectedRight]);
    setRightItems((current) =>
      current.filter((item) => !selectedRight.includes(item))
    );
    setSelectedRight([]);
  }

  // Delete selected items permanently
  function deleteItems(side) {
    if (side === "left") {
      setLeftItems((current) =>
        current.filter((item) => !selectedLeft.includes(item))
      );
      setSelectedLeft([]);
    } else {
      setRightItems((current) =>
        current.filter((item) => !selectedRight.includes(item))
      );
      setSelectedRight([]);
    }
  }

  // Start editing
  function startEdit(item, side) {
    setEditingItem(item);
    setEditValue(item);
    setEditSide(side);
  }

  // Save edited item name
  function saveEdit(e) {
    e.preventDefault();

    const name = editValue.trim();

    if (!name) {
      alert("Item name cannot be empty!");
      return;
    }

    const exists = [...leftItems, ...rightItems].some(
      (item) =>
        item.toLowerCase() === name.toLowerCase() &&
        item !== editingItem
    );

    if (exists) {
      alert("This item already exists!");
      return;
    }

    const setItems =
      editSide === "left" ? setLeftItems : setRightItems;

    setItems((current) =>
      current.map((item) => (item === editingItem ? name : item))
    );

    const updateSelection = (current) =>
      current.map((item) => (item === editingItem ? name : item));

    setSelectedLeft(updateSelection);
    setSelectedRight(updateSelection);

    setEditingItem(null);
    setEditValue("");
    setEditSide("");
  }

  function cancelEdit() {
    setEditingItem(null);
    setEditValue("");
    setEditSide("");
  }

  // Reusable list component
  function renderList(items, selected, side) {
    return (
      <div className="list-box">
        {items.map((item) => (
          <div
            key={item}
            className={`list-item ${
              selected.includes(item) ? "selected" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggleItem(item, side)}
              aria-label={`Select ${item}`}
            />

            {editingItem === item && editSide === side ? (
              <form className="edit-form" onSubmit={saveEdit}>
                <input
                  className="edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  aria-label="Edit item name"
                />

                <button className="save-btn" type="submit">
                  Save
                </button>

                <button
                  className="cancel-btn"
                  type="button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span className="item-name">{item}</span>

                <button
                  className="edit-btn"
                  type="button"
                  onClick={() => startEdit(item, side)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <p className="empty-message">No items available</p>
        )}
      </div>
    );
  }

  return (
    <main className="app">
      <header className="page-header">
        <span className="eyebrow"></span>
        <h1>Transfer List</h1>
        <p>Add, edit, delete and move items between lists.</p>
      </header>

      {/* Add item form */}
      <form className="add-form" onSubmit={addItem}>
        <input
          type="text"
          placeholder="Enter a new item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          aria-label="New item name"
        />
        <button type="submit" className="add-btn">
          + Add Item
        </button>
      </form>

      <section className="transfer-container" aria-label="Transfer items">
        {/* Left list */}
        <div className="list-section">
          <div className="list-heading">
            <h2>Available Items</h2>
            <span className="count">{leftItems.length}</span>
          </div>

          {renderList(leftItems, selectedLeft, "left")}

          <button
            className="delete-btn"
            onClick={() => deleteItems("left")}
            disabled={selectedLeft.length === 0}
          >
            Delete Selected
          </button>
        </div>

        {/* Transfer buttons */}
        <div className="buttons">
          <button
            className="move-button"
            onClick={moveRight}
            disabled={selectedLeft.length === 0}
            aria-label="Move selected items right"
            title="Move selected items right"
          >
            →
          </button>

          <button
            className="move-button"
            onClick={moveLeft}
            disabled={selectedRight.length === 0}
            aria-label="Move selected items left"
            title="Move selected items left"
          >
            ←
          </button>
        </div>

        {/* Right list */}
        <div className="list-section">
          <div className="list-heading">
            <h2>Selected Items</h2>
            <span className="count">{rightItems.length}</span>
          </div>

          {renderList(rightItems, selectedRight, "right")}

          <button
            className="delete-btn"
            onClick={() => deleteItems("right")}
            disabled={selectedRight.length === 0}
          >
            Delete Selected
          </button>
        </div>
      </section>

      <p className="hint">
        Select items using checkboxes. Use Edit to rename an item.
      </p>
    </main>
  );
}