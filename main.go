package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"strings"
)

func main() {
	csvfile, err := os.Open("ing.csv")

	if err != nil {
		fmt.Println(err)
		return
	}

	defer csvfile.Close()

	reader := csv.NewReader(csvfile)

	reader.FieldsPerRecord = -1

	rawCSVdata, err := reader.ReadAll()

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	targetcsv, err := os.Create("ynab.csv")

	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	defer targetcsv.Close()

	writer := csv.NewWriter(targetcsv)
	header := []string{"Date", "Payee", "Category", "Memo", "Outflow", "Inflow"}
	writer.Write(header)

	for _, row := range rawCSVdata {
		if row[0] != "Datum" {
			date := row[0][0:4]+"/"+row[0][4:6]+"/"+row[0][6:8]
			payee := row[1]
			category := ""
			memo := row[8]
			inflow := ""
			outflow := ""

			amount := strings.Replace(row[6], ",", ".", -1)
			if row[5] == "Bij" {
				inflow = amount
			} else {
				outflow = amount
			}

			writer.Write([]string{date, payee, category, memo, outflow, inflow})
		}
		fmt.Printf("Date: %s --- Name: %s\n", row[0], row[1])
	}
}
