import streamlit as st
import pandas as pd
from xlwt import Workbook
from io import BytesIO
from datetime import datetime
import re

# ----------------------------
# Constants
DEFAULT_NOTE = "kids clothes - If the number is unavailable, please reach out via WhatsApp"

POSTEX_COLUMNS = [
    "Order Reference Number", "Order Amount", "Order Detail", "Customer Name", "Customer Phone",
    "Order Address", "City", "Items", "Airway Bill Copies", "Notes",
    "Address Code", "Return Address Code", "Order Type (Normal/Reversed/Replacement/Overland)", "Booking Weight"
]

BLUEEX_COLUMNS = [
    "Consignee Name", "Consignee Address", "Consignee Contact No", "Consignee Email", "Product Name",
    "COD", "Pieces", "Weight", "Destination", "Customer Reference", "Customer Comment", "Store Id"
]

# ----------------------------
# Parse pasted orders
def parse_orders(raw_data):
    chunks = raw_data.strip().split("📦")
    orders = []
    for chunk in chunks:
        if not chunk.strip():
            continue
        order = {}
        lines = chunk.strip().splitlines()
        for line in lines:
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            key = key.strip().lower()
            value = value.strip()
            if key == "name":
                order["name"] = value
            elif key == "phone":
                order["phone"] = re.sub(r"[^\d]", "", value)
            elif key == "city":
                order["city"] = value
            elif key == "address":
                order["address"] = value
            elif key == "id":
                order["id"] = value
            elif key == "total":
                order["amount"] = re.sub(r"[^\d]", "", value)
            elif key == "items":
                order["items"] = value
            elif key == "order type":
                order["order_type"] = value
            elif key == "airway bill copy":
                order["awb"] = value
            elif key == "note":
                order["note"] = value
        orders.append(order)
    return orders

# ----------------------------
# Format to PostEx DataFrame
def build_postex_df(orders):
    rows = []
    for o in orders:
        note = o.get("note", "")
        full_note = f"{note} — {DEFAULT_NOTE}" if note else DEFAULT_NOTE
        rows.append([
            o.get("id", ""),
            o.get("amount", "0"),
            DEFAULT_NOTE,
            o.get("name", ""),
            o.get("phone", ""),
            o.get("address", ""),
            o.get("city", ""),
            o.get("items", "1"),
            o.get("awb", "1"),
            full_note,
            "",
            "",
            o.get("order_type", "Normal"),
            "0.5"
        ])
    return pd.DataFrame(rows, columns=POSTEX_COLUMNS)

# ----------------------------
# Format to BlueEx DataFrame
def build_blueex_df(orders):
    rows = []
    for o in orders:
        note = o.get("note", "")
        full_note = f"{note} — {DEFAULT_NOTE}" if note else DEFAULT_NOTE
        rows.append([
            o.get("name", ""),
            o.get("address", ""),
            o.get("phone", ""),
            "",
            "Kids Clothes",
            o.get("amount", "0"),
            o.get("items", "1"),
            "0.5",
            o.get("city", ""),
            o.get("id", ""),
            full_note,
            ""
        ])
    return pd.DataFrame(rows, columns=BLUEEX_COLUMNS)

# ----------------------------
# Create and return .xls from DataFrame
def create_xls(df):
    wb = Workbook()
    ws = wb.add_sheet("Orders")
    for col_index, col_name in enumerate(df.columns):
        ws.write(0, col_index, col_name)
    for row_index, row in enumerate(df.itertuples(index=False), start=1):
        for col_index, cell in enumerate(row):
            ws.write(row_index, col_index, str(cell))
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer

# ----------------------------
# Streamlit app UI
st.set_page_config(page_title="Courier Order Generator", layout="centered")
st.title("📦 WhatsApp Order → Excel (.xls) Generator")

style = st.selectbox("Select Courier Format", ["PostEx", "BlueEx"])

with st.expander("ℹ️ Format Example"):
    st.markdown("""
**Paste orders like this:**

📦 Parcel # Name: Rehmat Ullah
Phone: 03321730623
City: Dera Ismail Khan
Address: Eid Gha Kalan, Masjid Alsudes
ID: LIL11786
Total: 1700
Items: 3
Order Type: Normal
Airway Bill Copy: 1
Note: Call before delivery

""")

data_input = st.text_area("📋 Paste your orders below:", height=300)

if st.button("🚀 Generate Excel File"):
    if not data_input.strip():
        st.warning("❌ Please paste some order data first.")
    else:
        orders = parse_orders(data_input)
        df = build_postex_df(orders) if style == "PostEx" else build_blueex_df(orders)
        output_file = create_xls(df)
        filename = f"{style.lower()}_orders_{datetime.now().strftime('%Y%m%d')}.xls"
        st.success("✅ Your Excel file is ready below!")
        st.download_button(
            label=f"⬇️ Download {style} .xls File",
            data=output_file,
            file_name=filename,
            mime="application/vnd.ms-excel"
        )
