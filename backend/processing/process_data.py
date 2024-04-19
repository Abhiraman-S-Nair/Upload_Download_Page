import sys
import csv
import os

def process_csv(input_file_path, output_file_path):
    try:
        # Open the input CSV file for reading
        with open(input_file_path, 'r', newline='') as input_file:
            # Read the input CSV data
            csv_reader = csv.reader(input_file)
            data = [row for row in csv_reader]

        # Create the 'results' directory if it doesn't exist
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)

        # Open the output CSV file for writing
        with open(output_file_path, 'w', newline='') as output_file:
            # Write the data to the output CSV file
            csv_writer = csv.writer(output_file)
            csv_writer.writerows(data)

        print("CSV file processed successfully.")

    except Exception as e:
        print("Error processing CSV file:", e)

if __name__ == "__main__":
    # Check if the correct number of arguments is provided
    if len(sys.argv) != 3:
        print("Usage: python process_data.py <input_file_path> <output_file_path>")
        sys.exit(1)

    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]

    process_csv(input_file_path, output_file_path)
