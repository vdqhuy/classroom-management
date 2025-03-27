import React, { useState, useEffect } from "react";
import { Button } from "antd";

const VattuList = ({ vattu, setMuon, Muon }) => {
  const [localQuantities, setLocalQuantities] = useState({});

  useEffect(() => {
    setLocalQuantities({});
  }, [vattu]);

  const handleLocalChange = (maVT, value) => {
    setLocalQuantities((prev) => ({ ...prev, [maVT]: value }));
  };

  const handleConfirmQuantity = (maVT) => {
    const quantity = parseInt(localQuantities[maVT]);
    if (quantity && quantity > 0) {
      setMuon((prev) => {
        const newMuon = { ...prev, [maVT]: (prev[maVT] || 0) + quantity };
        console.log(newMuon);
        return newMuon;
      });      
      setLocalQuantities((prev) => ({ ...prev, [maVT]: "" }));
    }
  };

  return (
    <div>
      <h3>Danh sách vật tư</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {vattu.length > 0 ? (
          <table className="vattu-table">
            <thead>
              <tr>
                <th>Tên VT</th>
                <th>Số lượng còn lại</th>
                <th>Mã Phòng</th>
                <th>Số lượng mượn</th>
              </tr>
            </thead>
            <tbody>
              {vattu.map((item) => {
                const remainingQuantity = item.soLuong - (Muon[item.vatTu.maVt] || 0);
                return (
                  <tr
                    key={item.vatTu.maVt}
                    style={{
                      backgroundColor: item.maPhong ? "lightblue" : "lightpink",
                    }}
                  >
                    <td>{item.vatTu.tenVt}</td>
                    <td>{remainingQuantity}</td>
                    <td>{item.maPhong || "Tự do"}</td>
                    <td>
                      {item.maPhong ? (
                        <span>{item.soLuong}</span>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <input
                            type="number"
                            min="1"
                            max={remainingQuantity}
                            value={localQuantities[item.maVT] || ""}
                            onChange={(e) =>
                              handleLocalChange(item.maVT, e.target.value)
                            }
                            style={{ width: "80px" }}
                            disabled={remainingQuantity <= 0}
                          />
                          <Button
                            size="small"
                            onClick={() => handleConfirmQuantity(item.maVT)}
                            disabled={
                              !localQuantities[item.maVT] ||
                              remainingQuantity <= 0
                            }
                          >
                            Mượn
                          </Button>
                          <span>
                            {Muon[item.maVT]
                              ? `(Đã chọn: ${Muon[item.maVT]})`
                              : ""}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Không có vật tư nào.</p>
        )}
      </div>
    </div>
  );
};

export default VattuList;