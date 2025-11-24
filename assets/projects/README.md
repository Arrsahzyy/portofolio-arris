# Project Images

This folder is dedicated to storing images for your projects.

## How to add a new project image:

1.  Save your image here (supported formats: .jpg, .png, .webp, .jpeg).
    *   Recommended size: 800x600 pixels or 4:3 aspect ratio.
    *   Keep file sizes low (under 200KB) for faster loading.

2.  Open `assets/data/projects.json`.

3.  Find the project you want to update or add a new one.

4.  Update the `"image"` field with the path to your new image:
    ```json
    "image": "assets/projects/your-image-name.jpg"
    ```

## Example:

If you add a file named `my-robot.jpg` to this folder, your JSON entry should look like:

```json
{
    "id": "my-robot-project",
    "title": "My Cool Robot",
    ...
    "image": "assets/projects/my-robot.jpg",
    ...
}
```
