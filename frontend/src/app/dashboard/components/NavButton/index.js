import React from 'react';
import { Row, Avatar, Button, Tooltip } from 'antd';
import './index.css';

export const NavButton = ({ label, icon, avatarBgColor, color, size, style, active }) => {

  if (size === 'small') {
    return (
      <Row style={{ ...style, width: '48px', height: '48px', margin: '5px auto' }}>
        <Tooltip placement="right" title={label}>
          <div className="nav-small-button" style={{ background: active ? avatarBgColor : '', borderColor: active ? '#40a9ff' : '' }}>
            {icon}
          </div>
        </Tooltip>
      </Row>
    );
  } else {
    return (
      <Button style={{ ...style, width: '100%', borderRadius: 20, margin: '15px 0', padding: 16, display: 'flex', alignItems: 'center', height: 72, borderColor: active ? '#40a9ff' : '' }}>
        <Avatar shape="square" size="large" icon={icon} style={{ backgroundColor: avatarBgColor, color: color, borderRadius: 15, paddingTop: 2 }} />
        <span style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 16 }}>{label}</span>
      </Button>
    );
  }
}