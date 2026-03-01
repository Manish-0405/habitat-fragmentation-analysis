import rasterio
import matplotlib.pyplot as plt

# Path to your NDVI file
ndvi_file_path = r"C:\Users\manis\OneDrive\Documents\College\DCN\Habitate-Fragmentation\Analysis\AHEMDABAD_NDVI.tif"

# Open the .tif file
with rasterio.open(ndvi_file_path) as src:
    ndvi_data = src.read(1)  # Read the first band (NDVI band)
    plt.imshow(ndvi_data, cmap='RdYlGn')  # Display the NDVI data
    plt.colorbar()
    plt.title("NDVI of Ahmedabad")
    plt.show()
