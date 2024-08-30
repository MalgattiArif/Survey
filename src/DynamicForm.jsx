import React, { useState } from 'react';
import './DynamicForm.css';

const formElements = [
  { type: 'text', defaultLabel: 'Text Input' },
  { type: 'textarea', defaultLabel: 'Text Area' },
  { type: 'number', defaultLabel: 'Number Input' },
  { type: 'email', defaultLabel: 'Email Input' },
  { type: 'password', defaultLabel: 'Password Input' },
  { type: 'date', defaultLabel: 'Date Input' },
  { type: 'checkbox', defaultLabel: 'Checkbox' },
  { type: 'radio', defaultLabel: 'Radio Buttons' },
  { type: 'select', defaultLabel: 'Select Dropdown' },
  { type: 'file', defaultLabel: 'File Upload' },
];

export default function DynamicForm() {
  const [form, setForm] = useState([]);
  const [formName, setFormName] = useState('');
  const [editingElement, setEditingElement] = useState(null);

  const onDragStart = (e, elementType) => {
    e.dataTransfer.setData('text/plain', elementType);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text');
    const defaultLabel = formElements.find(el => el.type === elementType)?.defaultLabel || 'New Element';
    const newElement = { 
      type: elementType, 
      id: `${elementType}-${Date.now()}`,
      label: defaultLabel,
      name: defaultLabel.toLowerCase().replace(/\s+/g, '_'),
      placeholder: `Enter ${defaultLabel.toLowerCase()}`,
      options: ['radio', ,'select'].includes(elementType) ? [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ] : undefined
    };
    setForm([...form, newElement]);
  };

  const updateElement = (id, updates) => {
    setForm(form.map(element => 
      element.id === id ? { ...element, ...updates } : element
    ));
  };

  const removeElement = (id) => {
    setForm(form.filter(element => element.id !== id));
  };

  const addOption = (elementId) => {
    setForm(form.map(element => {
      if (element.id === elementId && element.options) {
        const newOption = { label: `Option ${element.options.length + 1}`, value: `option${element.options.length + 1}` };
        return { ...element, options: [...element.options, newOption] };
      }
      return element;
    }));
  };

  const removeOption = (elementId, optionIndex) => {
    setForm(form.map(element => {
      if (element.id === elementId && element.options) {
        return { ...element, options: element.options.filter((_, index) => index !== optionIndex) };
      }
      return element;
    }));
  };

  const updateOption = (elementId, optionIndex, updates) => {
    setForm(form.map(element => {
      if (element.id === elementId && element.options) {
        const newOptions = element.options.map((option, index) => 
          index === optionIndex ? { ...option, ...updates } : option
        );
        return { ...element, options: newOptions };
      }
      return element;
    }));
  };

  const renderFormElement = (element) => {
    const commonProps = {
      id: element.id,
      name: element.name,
      "aria-label": element.label,
      placeholder: element.placeholder,
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
        return <input {...commonProps} type={element.type} />;
      case 'textarea':
        return <textarea {...commonProps} />;
      case 'checkbox':
        return (
          <div className="checkbox-wrapper">
            <input {...commonProps} type="checkbox" />
            <label htmlFor={element.id}>{element.label}</label>
          </div>
        );
      case 'radio':
        return (
          <div className="radio-group">
            {element.options?.map((option, index) => (
              <div key={index} className="radio-option">
                <input 
                  type="radio" 
                  id={`${element.id}-${index}`} 
                  name={element.name} 
                  value={option.value} 
                />
                <label htmlFor={`${element.id}-${index}`}>{option.label}</label>
              </div>
            ))}
          </div>
        );
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case 'file':
        return <input {...commonProps} type="file" accept="image/*" />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Please enter a form name before submitting.");
      return;
    }

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formName, formElements: form }),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setForm([]);
        setFormName('');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="dynamic-form-builder">
      <div className="form-elements">
        <h2>Form Elements</h2>
        {formElements.map((element, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => onDragStart(e, element.type)}
            className="draggable-element"
          >
            {element.defaultLabel}
          </div>
        ))}
      </div>

      <div className="form-preview">
        <h2>Form Preview</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-name">
            <label htmlFor="form-name">Form Name</label>
            <input
              id="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
            />
          </div>
          <div 
            className="drop-zone"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            {form.map((element) => (
              <div key={element.id} className="form-element">
                <button type="button" className="edit-button" onClick={() => setEditingElement(element)}>Edit</button>
                <button type="button" className="remove-button" onClick={() => removeElement(element.id)}>X</button>
                <label htmlFor={element.id}>{element.label}</label>
                {renderFormElement(element)}
              </div>
            ))}
            {form.length === 0 && (
              <p className="empty-form">Drag and drop elements here</p>
            )}
          </div>
          <button type="submit" className="submit-button">Submit Form</button>
        </form>
      </div>

      {editingElement && (
        <div className="edit-modal">
          <h3>Edit Element</h3>
          <label>
            Label:
            <input 
              value={editingElement.label} 
              onChange={(e) => updateElement(editingElement.id, { label: e.target.value })}
            />
          </label>
          <label>
            Name:
            <input 
              value={editingElement.name} 
              onChange={(e) => updateElement(editingElement.id, { name: e.target.value })}
            />
          </label>
          <label>
            Placeholder:
            <input 
              value={editingElement.placeholder} 
              onChange={(e) => updateElement(editingElement.id, { placeholder: e.target.value })}
            />
          </label>
          {editingElement.options && (
            <div className="options-editor">
              <h4>Options</h4>
              {editingElement.options.map((option, index) => (
                <div key={index} className="option">
                  <input
                    value={option.label}
                    onChange={(e) => updateOption(editingElement.id, index, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  />
                  <button type="button" onClick={() => removeOption(editingElement.id, index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addOption(editingElement.id)}>Add Option</button>
            </div>
          )}
          <button type="button" onClick={() => setEditingElement(null)}>Close</button>
        </div>
      )}
    </div>
  );
}