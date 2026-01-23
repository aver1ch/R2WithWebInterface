import React from "react";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items?: string[];
};

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    title,
    items = [],
}) => {
    return (
        <>
            <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-header-title">{title}</h2>
                </div>

                <div className="sidebar-content">
                    {items.map((item, idx) => (
                        <div key={`${item}-${idx}`} className="history-item">
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
        </>
    );
};

export default Sidebar;