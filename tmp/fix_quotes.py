#!/usr/bin/env python3
import re

# Ler o arquivo
with open('../src/app/components/ContentArea.tsx', 'r') as f:
    content = f.read()

# Substituir className=\" por className="
content = content.replace('className=\\"', 'className="')

# Substituir outras aspas escapadas comuns
content = content.replace('\\"', '"')

# Escrever de volta
with open('../src/app/components/ContentArea.tsx', 'w') as f:
    f.write(content)

print("Arquivo corrigido!")
