import streamlit as st
from streamlit_drawable_canvas import st_canvas
import numpy as np

st.title("Streamlit Drawable Canvas - All Modes Demo")

# Specify canvas parameters
stroke_width = st.sidebar.slider("Stroke width: ", 1, 25, 3)
stroke_color = st.sidebar.color_picker("Stroke color hex: ", "#000000")
bg_color = st.sidebar.color_picker("Background color hex: ", "#ffffff")
fill_color = st.sidebar.color_picker("Fill color hex: ", "#FF0000")
bg_image = st.sidebar.file_uploader("Background image:", type=["png", "jpg"])

# Create a radio button for different drawing modes
drawing_mode = st.sidebar.radio(
    "Drawing tool:",
    ("freedraw", "line", "rect", "circle", "transform", "polygon", "point"),
)

realtime_update = st.sidebar.checkbox("Update in realtime", True)

# Create a canvas component
canvas_result = st_canvas(
    fill_color=fill_color,
    stroke_width=stroke_width,
    stroke_color=stroke_color,
    background_color=bg_color,
    background_image=bg_image,
    update_streamlit=realtime_update,
    height=400,
    width=600,
    drawing_mode=drawing_mode,
    point_display_radius=3 if drawing_mode == "point" else 0,
    key="canvas",
)

# Display the canvas results
if canvas_result.image_data is not None:
    st.write("Output Image:")
    st.image(canvas_result.image_data)

if canvas_result.json_data is not None:
    st.write("Canvas Data:")
    st.write(canvas_result.json_data)
    objects = canvas_result.json_data["objects"]

    # Display information about drawn objects
    if objects:
        st.write(f"Number of objects drawn: {len(objects)}")
        st.write("Objects by type:")
        object_types = {}
        for obj in objects:
            obj_type = obj.get("type", "unknown")
            object_types[obj_type] = object_types.get(obj_type, 0) + 1
        for obj_type, count in object_types.items():
            st.write(f"- {obj_type}: {count}")
