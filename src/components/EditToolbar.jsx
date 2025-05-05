import React from 'react';
import { Crop, Sun, RotateCcw } from 'lucide-react';

const EditToolbar = ({ onSelectTool, activeMode, onRotate }) => {
  const tools = [
    { name: 'crop', label: 'Crop', icon: <Crop size={20} /> },
    { name: 'brightness', label: 'Brightness', icon: <Sun size={20} /> },
    { name: 'rotate', label: 'Rotate', icon: <RotateCcw size={20} />, action: onRotate },
  ];

  const handleClick = (tool) => {
    if (tool.name === 'rotate' && tool.action) {
      tool.action();
    } else {
      onSelectTool(activeMode === tool.name ? null : tool.name);
    }
  };

  return (
    <div style={styles.toolbar}>
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => handleClick(tool)}
          style={{
            ...styles.button,
            ...(activeMode === tool.name ? styles.active : {}),
          }}
        >
          {tool.icon}
          <span style={styles.label}>{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

const styles = {
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    padding: '0.5rem 0',
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  button: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  label: {
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  },
  active: {
    opacity: 1,
    color: '#2563eb',
  },
};

export default EditToolbar;
