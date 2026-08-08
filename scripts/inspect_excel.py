import pandas as pd
import json
import sys

try:
    df = pd.read_excel('scripts/data/AI_Tools_in_Toolstaq_Enriched.xlsx')
    print("HEADERS:")
    print(df.columns.tolist())
    print("\nSAMPLE ROW:")
    print(df.iloc[0].to_dict())
except Exception as e:
    print(f"Error: {e}")
