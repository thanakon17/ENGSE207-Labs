## 1. C1: Context Diagram
ระบบนี้เป็น Web Application ที่พัฒนาด้วยแนวคิด Layered Architecture  
ผู้ใช้งานติดต่อกับระบบผ่าน Web Browser โดยส่ง HTTP Request  
ระบบจะประมวลผลข้อมูลตาม Business Logic และจัดเก็บข้อมูลในฐานข้อมูล SQLite

### Context Diagram
┌──────────────┐
│ User         │
│ (Web Client) │
└───────┬──────┘
        │ HTTP Request / Response
        ▼
┌──────────────────────────┐
│ Web Application          │
│ (Layered Architecture)   │
└───────┬──────────────────┘
        │ SQL Queries
        ▼
┌──────────────┐
│ SQLite       │
│ Database     │
└──────────────┘

## 2. C2: Container Diagram (Layered Architecture)
ระบบถูกออกแบบโดยใช้โครงสร้างแบบ Layered Architecture  
แบ่งออกเป็น 3 Layer หลัก เพื่อแยกหน้าที่ความรับผิดชอบของระบบอย่างชัดเจน

### Container Diagram
┌────────────────────────────────────────────┐
│ Presentation Layer                         │
│ ┌────────────────────────────────────────┐ │
│ │ Routes                                 │ │
│ │ Controllers                            │ │
│ │ (Handle HTTP Request / Response)       │ │
│ └────────────────────────────────────────┘ │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│ Business Logic Layer                       │
│ ┌────────────────────────────────────────┐ │
│ │ Services                               │ │
│ │ Validators                             │ │
│ │ (Business Rules & Validation)          │ │
│ └────────────────────────────────────────┘ │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│ Data Access Layer                          │
│ ┌────────────────────────────────────────┐ │
│ │ Repositories                           │ │
│ │ SQL Queries                            │ │
│ │ (CRUD Operations)                      │ │
│ └────────────────────────────────────────┘ │
└────────────────────┬───────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ SQLite       │
              │ Database     │
              └──────────────┘

## 3. Responsibilities ของแต่ละ Layer

### 3.1 Presentation Layer
ทำหน้าที่เป็นจุดเชื่อมต่อระหว่างผู้ใช้งานและระบบ

**Responsibilities**
- รับ HTTP Request จาก Client
- กำหนด Routing และ HTTP Method
- เรียกใช้งาน Controller
- แปลงข้อมูล Request และ Response เป็น JSON
- ไม่ควรมี Business Logic อยู่ใน Layer นี้

### 3.2 Business Logic Layer
เป็นส่วนที่ควบคุมกฎและกระบวนการทำงานหลักของระบบ

**Responsibilities**
- ประมวลผล Business Rules
- ตรวจสอบความถูกต้องของข้อมูล (Validation)
- ควบคุมลำดับขั้นตอนการทำงาน
- เรียกใช้งาน Data Access Layer

### 3.3 Data Access Layer
เป็น Layer ที่ติดต่อกับฐานข้อมูลโดยตรง

**Responsibilities**
- เขียนและจัดการ SQL Queries
- ติดต่อกับฐานข้อมูล SQLite
- จัดการข้อมูลแบบ CRUD (Create, Read, Update, Delete)
- ไม่ควรมี Business Logic อยู่ใน Layer นี้

### 3.4 Database (SQLite)

**Responsibilities**
- จัดเก็บข้อมูลของระบบอย่างถาวร
- ประมวลผลคำสั่ง SQL
- รักษาความถูกต้องและความสมบูรณ์ของข้อมูล

## 4. Data Flow (Request → Response)

ลำดับการทำงานของระบบมีดังนี้

1. ผู้ใช้งานส่ง HTTP Request จาก Web Browser
2. Presentation Layer รับ Request ผ่าน Route และ Controller
3. Controller เรียกใช้งาน Service ใน Business Logic Layer
4. Service ตรวจสอบ Business Rules และ Validation
5. Service เรียกใช้งาน Repository ใน Data Access Layer
6. Repository ส่ง SQL Query ไปยัง SQLite Database
7. Database ส่งผลลัพธ์กลับไปยัง Repository
8. Repository ส่งข้อมูลกลับไปยัง Service
9. Service ส่งผลลัพธ์กลับไปยัง Controller
10. Controller ส่ง HTTP Response (JSON) กลับไปยังผู้ใช้งาน

## 5. Summary

ระบบนี้ถูกออกแบบโดยใช้ Layered Architecture  
ช่วยให้โครงสร้างระบบมีความชัดเจน แยกหน้าที่รับผิดชอบอย่างเป็นระบบ  
ง่ายต่อการพัฒนา บำรุงรักษา และขยายระบบในอนาคต
