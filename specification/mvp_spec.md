# **Zavisi \- Macedonian Legal AI Assistant \- System Overview (MVP Roadmap)**

## **1\. Goal**

Build a **Macedonian-language legal assistant** that answers legal questions by retrieving and citing **actual Macedonian law**, rather than relying on LLM memory.

The system will:

* ingest public legal publications,  
* reconstruct **current consolidated law texts** from amendment acts,  
* index them for **hybrid semantic \+ lexical search**,  
* retrieve relevant articles,  
* generate answers in Macedonian with **citations to law and article numbers**.

The system must handle:

* amendment-based legal updates,  
* constitutional hierarchy,  
* multilingual AI models that support Macedonian,  
* traceable answers with legal provenance.

The MVP will focus on **accurate retrieval and citation**, not on replacing legal advice.

# **2\. Core Principles**

The system is built around several design principles.

### **2.1 Laws are versioned systems**

Laws change through **amendments**, not full replacements.Therefore the system must reconstruct **consolidated law versions**.

Consolidated law versions are published from time to time, so they can serve as a validation of the consolidation system.

### **2.2 Sources are hierarchical**

Legal sources have authority levels:

1. Constitution  
2. Laws  
3. Bylaws  
4. Administrative regulations (future)

Higher authority sources can influence interpretation of lower ones.

### **2.3 Retrieval must be hybrid**

Legal queries require both:

* **exact lexical search** (article numbers, legal terminology)  
* **semantic search** (natural-language questions)

Therefore retrieval combines:

* BM25 full-text search  
* vector embeddings  
* reranking

### **2.4 LLMs must not hallucinate law**

The LLM should only answer **from retrieved sources**.

Every answer must cite:

* law title  
* article number  
* source text

# **3\. High-Level Architecture**

The system consists of **seven main components**.

Legal Publications Ingestion  
       ↓  
Document Ingestion  
       ↓  
Legal Parser  
       ↓  
Amendment Operations  
       ↓  
Law Consolidation Engine  
       ↓  
Search Index (Hybrid)  
       ↓  
RAG Answer Engine

# **4\. Component Overview**

## 4.1 Legal Publication Ingestion

Collect official legal publications such as:

* Constitution  
* Constitutional amendments  
* Laws  
* Law amendments  
* Bylaws  
* Draft laws (optional)

Each publication is stored as an immutable source.

Stored metadata:

* Title (Кривичен законик, Закон за изменување и дополнување на Кривичниот законик, Одлука на Уставниот Суд на Република Македонија, У.бр.228/2005 од 5 април 2006 година)  
* publication date (29.07.1996)  
* Start date ( 06.08.1996)  
* End date  
* Application date  
* official gazette number (37)  
* document type (Закон, Одлука)  
* Version (Изворен текст, Текст измена/дополна)  
* Status (Активен, Неактивен)  
* source URL  
* raw document

Output collection:

legal\_publications

### 4.1.1 Publication sources

Law publications are bundled together with a lot of useless information in the legal gazette (Службен весник). Therefore, the document sources must be specified for each law. 

Example: 

- [https://dit.gov.mk/single/page/Regulativa](https://dit.gov.mk/single/page/Regulativa)   
- [https://ldbis.pravda.gov.mk/Prebaruvanje.aspx](https://ldbis.pravda.gov.mk/Prebaruvanje.aspx)  
- [https://slvesnik.com.mk/besplaten-pristap-do-izdanija.nspx](https://slvesnik.com.mk/besplaten-pristap-do-izdanija.nspx) 

The system must be able to

- Scrape government sites and download documents  
- Infer the document type from the file name, title, content and other metadata  
- Accept documents in Macedonian only (the same documents may be published in Albanian)

Stored data:

- Source URL  
- Description  
- Scrape instructions


Output collection:   
legal\_publication\_source

## 4.2 Legal Document Parser

Legal publications are parsed into structured elements.

Typical hierarchy:

Law (закон) \-\> Chapter \-\>  Section \-\> Article (член) \-\> Paragraph \-\> Item (possibly, not always, став)

The parser extracts:

* article numbers  
* Title  
* Item (if applicable)  
* structural hierarchy  
* text content  
* references to amended articles

Output:

legal\_articles\_raw

## 4.3 Amendment Operation Extraction

Amendment acts describe **operations**, not full documents. Possible operations are (not limited to):

- Add an item to an article  
- Add article text  
- Amend article text or items  
- Replace article text or items  
- Delete article text or items  
- A combination of the above

Amendment acts also may contain articles about when the amendment acts themselves come into power. These are unrelated to the actual law itself, but should be parsed to extract dates if possible.

Example statements:

* \`Article 82 is replaced\`  
* \`After Article 82 add Article 82-a\`  
* \`Article 91 is deleted\`  
* \`Во членот 192 став (1) по зборот „решение“ се додаваат зборовите: „во рок од 15 дена од денот на поднесувањето на барањето од членот 191 став (1) од овој закон.“\`  
* \`Во член 213-в по ставот (4) се додава нов став (5), кој гласи: „(5) Образецот на барањето од ставот (1) на овој член го пропишува министерот надлежен за работите од областа на трудот во согласност со министерот за информатичко општество и администрација.”\`  
* \`По членот 218-а се додава нов наслов и нов член 218-б, кои гласат: …\`

These must be converted into structured operations.

Example operation:

{  
 "law\_id": "labor-law",  
 "operation\_type": "replace\_article",  
 "target\_article": "82",  
 "new\_text": "...",  
 "effective\_date": "2026-03-01"  
}

Output collection:

legal\_operations

Operation types include:

* add article

* replace article

* delete article

* replace paragraph

* repeal law

## 4.4 Law Consolidation Engine

This is the **core component**.

It reconstructs the current version of a law by applying amendment operations.

Process:

base law  
  ↓  
apply amendments in chronological order  
  ↓  
produce consolidated article versions

The system can reconstruct:

* current law  
* historical versions of law

Example consolidated article record:

{  
 "law\_id": "labor-law",  
 "article\_key": "82",  
 “article\_item”: 1,  
 "version\_from": "2025-09-17",  
 "version\_to": null,  
 "status": "in\_force",  
 "text": "...",  
 "derived\_from": \["SG-12-2024", "SG-91-2025"\]  
}

Output collection:

legal\_article\_versions

## 4.5 Legal Hierarchy Layer

Legal documents have authority ranking.

Example:

| Authority | Rank |
| ----- | ----- |
| Constitution | 100 |
| Law | 50 |
| Bylaw | 20 |

Each article record stores:

authority\_rank  
legal\_family

This allows retrieval to:

* prioritize higher authority sources  
* include constitutional context when relevant

## 4.6 Hybrid Search Index

All consolidated articles are indexed into a search engine.

Recommended engine:

* Elasticsearch  
   or  
* OpenSearch

Indexed fields:

* article text  
* law title  
* article number  
* Item number  
* authority rank  
* effective date  
* embeddings

Each article is stored with both:

BM25 text index  
vector embedding

This enables **hybrid retrieval**.

## 4.7 Embedding Generation

Embeddings convert text into vectors for semantic search.

Recommended multilingual models:

* `multilingual-e5-large`  
* `bge-m3`

Embedding input format:

Law: Закон за работни односи  
Article: 82  
Text: ...

Embeddings are stored in the search index.

## 4.8 Retrieval Pipeline

When a user asks a question:

User query  
  ↓  
Query embedding  
  ↓  
BM25 search  
  ↓  
Vector search  
  ↓  
Merge results  
  ↓  
Reranker scoring  
  ↓  
Top legal passages

Typical candidate flow:

BM25 top 30  
Vector top 30  
Merged candidates 40–50  
Reranker → top 5–8

## 4.9 Reranking

A cross-encoder model reorders results by relevance.

Recommended models:

* `bge-reranker-v2-m3`

This stage removes semantically similar but irrelevant passages.

## 4.10 Answer Generation (RAG)

The LLM receives:

* user question  
* top legal passages  
* metadata

The LLM must:

* answer in Macedonian  
* cite law title and article  
* quote relevant text  
* avoid speculation

Answer format:

Answer  
Legal basis  
Citations  
Notes / caveats

Example:

Според Законот за работни односи, член 82...

Правна основа:  
Закон за работни односи, член 82

# **5\. Constitutional Integration**

The Constitution is treated as:

1. **versioned legal text**  
2. **highest authority source**

Constitutional amendments are processed the same way as laws.

Constitutional articles can be retrieved when:

* query involves rights  
* query involves legal principles  
* query involves procedural guarantees

Examples:

* equality  
* right to appeal  
* due process  
* property rights

# **6\. Data Storage Model**

Main collections:

legal\_publications  
legal\_operations  
legal\_article\_versions  
query\_logs  
evaluation\_cases

Primary retrieval unit:

legal\_article\_versions

# **7\. System Services**

Recommended services:

api-gateway  
ingestion-worker  
parser-worker  
operation-extractor  
consolidation-engine  
embedding-worker  
retrieval-service  
answer-service  
evaluation-service

# **8\. Technology Stack (Suggested)**

Backend

* NestJS  
* BullMQ / Redis queues

Search

* Elasticsearch or OpenSearch

Embeddings / reranker

* Python microservice

LLM

* GPT-4o / Claude / similar

Storage

* MongoDB  
* local storage for raw documents

# **9\. Evaluation Framework**

To measure system quality, create a test set of real legal questions.

Example:

200–500 Macedonian legal questions

Evaluate:

* article retrieval accuracy  
* citation correctness  
* hallucination rate  
* answer completeness

# **10\. MVP Scope**

Do not start with all Macedonian law. Start with labour law.

Steps:

1. Download relevant documents  
2. ingest base law  
3. ingest amendment acts  
4. implement consolidation engine  
5. index consolidated articles  
6. implement hybrid retrieval  
7. connect LLM answer generation

Only after validation expand to more domains.

# **11\. Future Extensions**

Possible later additions:

* Constitutional court decisions  
* Case law  
* Legal commentary  
* Contract analysis  
* Legal document generation  
* Timeline view of legal changes

# **Final Summary**

The system is fundamentally a **legal knowledge reconstruction engine** with AI on top.

It works by:

1. collecting official legal publications  
2. extracting amendment operations  
3. reconstructing consolidated law texts  
4. indexing articles with hybrid search  
5. retrieving relevant legal passages  
6. generating cited answers in Macedonian

The LLM does not replace legal data — it **explains it**.

