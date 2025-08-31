import requests
import streamlit as st

st.title("Environmental Monitoring LLM API Demo")

api_url = "http://10.251.65.157:8000/analyze"  # Use deployed Vercel API

uploaded_files = st.file_uploader("Upload images", type=["jpg", "jpeg", "png"], accept_multiple_files=True)
prompt = st.text_area("Prompt", "analyse")

if uploaded_files and st.button("Analyze"):
    files = [("files", (f.name, f, "image/jpeg")) for f in uploaded_files]
    data = {"prompt": prompt}
    response = requests.post(api_url, files=files, data=data)
    if response.status_code == 200:
        st.write("Model's result:")
        st.write(response.json()["result"])
    else:
        st.error(f"Error: {response.text}")