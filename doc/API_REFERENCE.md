# 🔌 API Reference - GestãoZe System

<div align="center">

[![API](https://img.shields.io/badge/API-RESTful-blue?style=for-the-badge&logo=api&logoColor=white)](#)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Auth](https://img.shields.io/badge/Auth-JWT-red?style=for-the-badge&logo=auth0&logoColor=white)](#)

**Documentação completa das APIs e endpoints do GestãoZe System**

*Interface de programação para integração e desenvolvimento*

</div>

---

## 📋 **Índice de APIs**

- [🔐 Authentication](#-authentication-api)
- [👤 Users & Profile](#-users--profile-api)
- [📦 Inventory Management](#-inventory-management-api)
- [🏪 Suppliers](#-suppliers-api)
- [💰 Financial Data](#-financial-data-api)
- [🍽️ Menu Management](#-menu-management-api)
- [📊 Reports & Analytics](#-reports--analytics-api)
- [🤖 AI Integration](#-ai-integration-api)
- [⚙️ System Settings](#-system-settings-api)
- [📝 Audit Logs](#-audit-logs-api)

---

## 🌐 **Base Configuration**

### 🔧 **Environment Setup**

```typescript
// Supabase Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

// Base API URL
const API_BASE_URL = "https://cxusoclwtixtjwghjlcj.supabase.co"

// Headers
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${jwt_token}`,
  'apikey': supabaseKey
}
```

### 📊 **Response Format**

```typescript
interface ApiResponse<T> {
  data: T | null
  error: {
    message: string
    details?: string
    code?: string
  } | null
  status: number
  count?: number
}

// Success Response
{
  "data": { /* response data */ },
  "error": null,
  "status": 200,
  "count": 1
}

// Error Response
{
  "data": null,
  "error": {
    "message": "Resource not found",
    "code": "PGRST116"
  },
  "status": 404
}
```

---

## 🔐 **Authentication API**

### 🔑 **JWT Token Authentication**

<table>
<tr>
<td width="50%">

#### **POST** `/auth/v1/token`
**Login with credentials**

```typescript
// Request
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "v1.refresh_token...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "authenticated"
  }
}
```

</td>
<td width="50%">

#### **POST** `/auth/v1/logout`
**Revoke current session**

```typescript
// Request
{
  "refresh_token": "v1.refresh_token..."
}

// Response
{
  "message": "Successfully logged out"
}
```

#### **POST** `/auth/v1/refresh`
**Refresh access token**

```typescript
// Request
{
  "refresh_token": "v1.refresh_token..."
}

// Response
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

</td>
</tr>
</table>

---

## 👤 **Users & Profile API**

### 📋 **Admin Users Management**

#### **GET** `/rest/v1/admin_users`
**List all admin users**

```typescript
// Query Parameters
?select=id,username,email,name,role,avatar_url,created_at
&order=created_at.desc
&limit=20
&offset=0

// Response
{
  "data": [
    {
      "id": "uuid",
      "username": "admin",
      "email": "admin@restaurant.com",
      "name": "Administrator",
      "role": "admin",
      "avatar_url": "https://storage.url/avatar.jpg",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

#### **GET** `/rest/v1/admin_users?id=eq.{user_id}`
**Get user profile**

```typescript
// Response
{
  "data": {
    "id": "uuid",
    "username": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin",
    "avatar_url": "https://...",
    "preferences": {
      "darkMode": false,
      "language": "pt-BR",
      "emailNotifications": true
    },
    "login_count": 45,
    "last_login": "2025-09-26T10:30:00Z"
  }
}
```

#### **PATCH** `/rest/v1/admin_users?id=eq.{user_id}`
**Update user profile**

```typescript
// Request
{
  "name": "Updated Name",
  "preferences": {
    "darkMode": true,
    "language": "en-US"
  }
}

// Response
{
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "preferences": { /* updated preferences */ },
    "updated_at": "2025-09-26T10:35:00Z"
  }
}
```

---

## 📦 **Inventory Management API**

### 🏷️ **Categories**

#### **GET** `/rest/v1/categorias`
**List product categories**

```typescript
// Query Parameters
?select=*
&ativo=eq.true
&order=nome.asc

// Response
{
  "data": [
    {
      "id": "uuid",
      "nome": "Bebidas",
      "descricao": "Bebidas e líquidos",
      "cor": "#3B82F6",
      "ativo": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### **POST** `/rest/v1/categorias`
**Create new category**

```typescript
// Request
{
  "nome": "Nova Categoria",
  "descricao": "Descrição da categoria",
  "cor": "#10B981"
}

// Response
{
  "data": {
    "id": "new-uuid",
    "nome": "Nova Categoria",
    "descricao": "Descrição da categoria",
    "cor": "#10B981",
    "ativo": true,
    "created_at": "2025-09-26T10:40:00Z"
  }
}
```

### 📦 **Products**

#### **GET** `/rest/v1/produtos`
**List products with advanced filtering**

```typescript
// Query Parameters
?select=*,categorias(nome,cor)
&ativo=eq.true
&current_stock=gte.0
&order=nome.asc
&limit=50

// Response
{
  "data": [
    {
      "id": "uuid",
      "nome": "Coca-Cola 350ml",
      "categoria_id": "cat-uuid",
      "preco": 5.50,
      "custo": 2.80,
      "current_stock": 120,
      "min_stock": 20,
      "max_stock": 200,
      "unidade": "unidade",
      "descricao": "Refrigerante cola 350ml",
      "codigo_barras": "789123456789",
      "imagem_url": "https://...",
      "ativo": true,
      "categorias": {
        "nome": "Bebidas",
        "cor": "#3B82F6"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 45
}
```

#### **POST** `/rest/v1/produtos`
**Create new product**

```typescript
// Request
{
  "nome": "Novo Produto",
  "categoria_id": "cat-uuid",
  "preco": 15.90,
  "custo": 8.50,
  "current_stock": 0,
  "min_stock": 5,
  "max_stock": 100,
  "unidade": "kg",
  "descricao": "Descrição do produto",
  "codigo_barras": "123456789012"
}

// Response
{
  "data": {
    "id": "new-uuid",
    /* product data */,
    "created_at": "2025-09-26T10:45:00Z"
  }
}
```

#### **GET** `/rest/v1/produtos?current_stock=lt.min_stock`
**Get low stock products**

```typescript
// Response: Products where current_stock < min_stock
{
  "data": [
    {
      "id": "uuid",
      "nome": "Produto em Falta",
      "current_stock": 2,
      "min_stock": 10,
      "status": "low_stock"
    }
  ]
}
```

### 📋 **Stock Movements**

#### **GET** `/rest/v1/movements`
**List stock movements**

```typescript
// Query Parameters
?select=*,produtos(nome),admin_users(name)
&order=created_at.desc
&limit=50

// Response
{
  "data": [
    {
      "id": "uuid",
      "produto_id": "prod-uuid",
      "tipo": "entrada",
      "quantidade": 50,
      "valor_unitario": 2.80,
      "observacao": "Compra fornecedor ABC",
      "user_id": "user-uuid",
      "created_at": "2025-09-26T09:30:00Z",
      "produtos": {
        "nome": "Coca-Cola 350ml"
      },
      "admin_users": {
        "name": "João Silva"
      }
    }
  ]
}
```

#### **POST** `/rest/v1/movements`
**Record stock movement**

```typescript
// Request
{
  "produto_id": "prod-uuid",
  "tipo": "entrada", // "entrada" | "saida" | "ajuste"
  "quantidade": 100,
  "valor_unitario": 2.50,
  "observacao": "Entrada por compra",
  "user_id": "user-uuid"
}

// Response
{
  "data": {
    "id": "new-uuid",
    /* movement data */,
    "created_at": "2025-09-26T10:50:00Z"
  }
}
```

---

## 🏪 **Suppliers API**

#### **GET** `/rest/v1/suppliers`
**List suppliers**

```typescript
// Response
{
  "data": [
    {
      "id": "uuid",
      "nome": "Fornecedor ABC Ltda",
      "contato": "João Vendas",
      "telefone": "(11) 98765-4321",
      "email": "vendas@fornecedorabc.com",
      "endereco": "Rua das Flores, 123",
      "cnpj": "12.345.678/0001-90",
      "ativo": true,
      "created_at": "2025-01-15T00:00:00Z"
    }
  ]
}
```

#### **POST** `/rest/v1/suppliers`
**Create new supplier**

```typescript
// Request
{
  "nome": "Novo Fornecedor",
  "contato": "Maria Silva",
  "telefone": "(11) 12345-6789",
  "email": "contato@novofornecedor.com",
  "cnpj": "98.765.432/0001-10"
}

// Response
{
  "data": {
    "id": "new-uuid",
    /* supplier data */,
    "created_at": "2025-09-26T10:55:00Z"
  }
}
```

---

## 💰 **Financial Data API**

#### **GET** `/rest/v1/financial_data`
**Get financial records**

```typescript
// Query Parameters
?select=*
&order=created_at.desc
&limit=100

// Response
{
  "data": [
    {
      "id": 1,
      "full_day": "2025-09-26",
      "amount": 1250.80,
      "total": 1250.80,
      "created_at": "2025-09-26T00:00:00Z",
      "updated_at": "2025-09-26T00:00:00Z"
    }
  ]
}
```

#### **POST** `/rest/v1/financial_data`
**Add financial record**

```typescript
// Request
{
  "full_day": "2025-09-26",
  "amount": 890.50,
  "total": 890.50
}

// Response
{
  "data": {
    "id": 2,
    "full_day": "2025-09-26",
    "amount": 890.50,
    "total": 890.50,
    "created_at": "2025-09-26T11:00:00Z"
  }
}
```

#### **GET** `/rest/v1/rpc/financial_summary`
**Get financial summary (Custom RPC)**

```typescript
// Response
{
  "data": {
    "total_revenue": 45680.90,
    "monthly_average": 3806.74,
    "best_day": {
      "date": "2025-08-15",
      "amount": 2100.00
    },
    "growth_rate": 12.5,
    "last_30_days": 11250.30
  }
}
```

---

## 🍽️ **Menu Management API**

#### **GET** `/rest/v1/menu_items`
**List menu items**

```typescript
// Response
{
  "data": [
    {
      "id": "uuid",
      "nome": "Hambúrguer Artesanal",
      "descricao": "Hambúrguer 180g com queijo e bacon",
      "preco": 28.90,
      "categoria": "Lanches",
      "ingredientes": [
        "Pão brioche",
        "Hambúrguer 180g",
        "Queijo cheddar",
        "Bacon",
        "Alface",
        "Tomate"
      ],
      "tempo_preparo": 15,
      "disponivel": true,
      "imagem_url": "https://...",
      "created_at": "2025-01-10T00:00:00Z"
    }
  ]
}
```

#### **POST** `/rest/v1/menu_items`
**Create menu item**

```typescript
// Request
{
  "nome": "Nova Pizza",
  "descricao": "Pizza especial da casa",
  "preco": 42.00,
  "categoria": "Pizzas",
  "ingredientes": ["Massa", "Molho", "Queijo", "Pepperoni"],
  "tempo_preparo": 25
}

// Response
{
  "data": {
    "id": "new-uuid",
    /* menu item data */,
    "created_at": "2025-09-26T11:05:00Z"
  }
}
```

---

## 📊 **Reports & Analytics API**

### 📈 **Custom RPC Functions**

#### **POST** `/rest/v1/rpc/inventory_report`
**Generate inventory report**

```typescript
// Request
{
  "start_date": "2025-09-01",
  "end_date": "2025-09-26",
  "category_ids": ["cat-uuid-1", "cat-uuid-2"]
}

// Response
{
  "data": {
    "total_products": 125,
    "total_value": 15680.90,
    "low_stock_items": 8,
    "categories_breakdown": [
      {
        "category": "Bebidas",
        "product_count": 45,
        "total_value": 5200.50
      }
    ],
    "movements_summary": {
      "entries": 156,
      "exits": 234,
      "adjustments": 12
    }
  }
}
```

#### **POST** `/rest/v1/rpc/sales_analytics`
**Get sales analytics**

```typescript
// Request
{
  "period": "monthly", // "daily" | "weekly" | "monthly" | "yearly"
  "year": 2025,
  "month": 9
}

// Response
{
  "data": {
    "period": "monthly",
    "total_sales": 23450.80,
    "average_daily": 781.69,
    "top_products": [
      {
        "product_id": "uuid",
        "name": "Coca-Cola 350ml",
        "quantity_sold": 245,
        "revenue": 1347.50
      }
    ],
    "daily_breakdown": [
      {
        "date": "2025-09-01",
        "sales": 856.90,
        "orders": 34
      }
    ]
  }
}
```

---

## 🤖 **AI Integration API**

### 🧠 **Google Gemini Integration**

#### **POST** `/api/ai/analyze-inventory`
**AI-powered inventory analysis**

```typescript
// Request
{
  "context": "inventory_optimization",
  "data": {
    "products": [/* product array */],
    "movements": [/* movement array */],
    "sales_data": [/* sales array */]
  },
  "questions": [
    "Quais produtos devo comprar esta semana?",
    "Como posso reduzir custos de estoque?"
  ]
}

// Response
{
  "data": {
    "analysis": {
      "summary": "Análise completa do estoque atual...",
      "insights": [
        {
          "type": "recommendation",
          "priority": "high",
          "message": "Reabastecer Coca-Cola 350ml - estoque crítico",
          "action": "purchase",
          "quantity": 200
        }
      ],
      "cost_optimization": [
        {
          "suggestion": "Negociar desconto com fornecedor ABC",
          "potential_saving": 450.00,
          "products": ["Produto A", "Produto B"]
        }
      ],
      "forecasting": {
        "next_30_days": {
          "estimated_sales": 8500.00,
          "required_purchases": 3200.00
        }
      }
    },
    "confidence": 0.87,
    "processing_time": "2.3s"
  }
}
```

#### **POST** `/api/ai/financial-insights`
**AI financial analysis**

```typescript
// Request
{
  "financial_data": [/* financial records */],
  "period": "last_90_days",
  "analysis_type": "comprehensive"
}

// Response
{
  "data": {
    "trends": {
      "direction": "growing",
      "growth_rate": 15.2,
      "seasonal_patterns": ["Weekend peaks", "Month-end spikes"]
    },
    "recommendations": [
      {
        "category": "revenue_optimization",
        "suggestion": "Implementar promoções nas terças-feiras",
        "impact": "Potencial aumento de 8% na receita"
      }
    ],
    "predictions": {
      "next_month": {
        "revenue_forecast": 12500.00,
        "confidence": 0.82
      }
    }
  }
}
```

---

## ⚙️ **System Settings API**

#### **GET** `/rest/v1/settings`
**Get system settings**

```typescript
// Response
{
  "data": [
    {
      "id": "uuid",
      "key": "app_theme",
      "value": "light",
      "description": "Application theme preference",
      "type": "string",
      "updated_at": "2025-09-26T11:10:00Z"
    }
  ]
}
```

#### **POST** `/rest/v1/settings`
**Update system setting**

```typescript
// Request
{
  "key": "notification_email",
  "value": "admin@restaurant.com",
  "description": "Email for system notifications",
  "type": "email"
}

// Response
{
  "data": {
    "id": "new-uuid",
    "key": "notification_email",
    "value": "admin@restaurant.com",
    "updated_at": "2025-09-26T11:15:00Z"
  }
}
```

---

## 📝 **Audit Logs API**

#### **GET** `/rest/v1/system_logs`
**Get system audit logs**

```typescript
// Query Parameters
?select=*,admin_users(name)
&order=created_at.desc
&limit=100

// Response
{
  "data": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "action": "product_created",
      "details": {
        "product_id": "prod-uuid",
        "product_name": "Novo Produto",
        "category": "Bebidas"
      },
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-09-26T11:20:00Z",
      "admin_users": {
        "name": "João Silva"
      }
    }
  ]
}
```

#### **POST** `/rest/v1/system_logs`
**Create audit log entry**

```typescript
// Request
{
  "user_id": "user-uuid",
  "action": "stock_movement",
  "details": {
    "type": "entrada",
    "product": "Coca-Cola 350ml",
    "quantity": 100
  }
}

// Response
{
  "data": {
    "id": "new-uuid",
    "action": "stock_movement",
    "created_at": "2025-09-26T11:25:00Z"
  }
}
```

---

## 📁 **File Upload API (Supabase Storage)**

### 📸 **Avatar Upload**

#### **POST** `/storage/v1/object/user-avatars/{user_id}/{filename}`
**Upload user avatar**

```typescript
// Request (multipart/form-data)
const formData = new FormData()
formData.append('file', file)

// Headers
{
  'Authorization': `Bearer ${jwt_token}`,
  'Content-Type': 'multipart/form-data'
}

// Response
{
  "Key": "user-avatars/uuid/avatar.jpg",
  "Id": "storage-id"
}

// Public URL
const publicUrl = `${supabaseUrl}/storage/v1/object/public/user-avatars/${userId}/${filename}`
```

---

## 🔍 **Advanced Querying**

### 📊 **PostgREST Query Features**

<table>
<tr>
<td width="50%">

#### 🎯 **Filtering**
```typescript
// Exact match
?name=eq.João

// Comparison operators
?stock=gte.10        // >=
?stock=lt.5          // <
?price=gte.10&price=lte.50  // BETWEEN

// Pattern matching
?name=ilike.*coca*   // Case insensitive LIKE
?email=like.*gmail.com

// Array operations
?id=in.(uuid1,uuid2,uuid3)
```

#### 🔗 **Joins & Relationships**
```typescript
// Select with relationship
?select=*,categorias(nome,cor)

// Nested filtering
?select=*,categorias(nome)&categorias.ativo=eq.true

// Count relationships
?select=*,movements(count)
```

</td>
<td width="50%">

#### 📑 **Ordering & Pagination**
```typescript
// Ordering
?order=created_at.desc
?order=name.asc,price.desc

// Pagination
?limit=20&offset=40

// Range
?limit=10&offset=0    // First 10
```

#### 🔢 **Aggregations**
```typescript
// Custom RPC functions
?rpc/total_sales&start_date=2025-01-01

// Count
?select=count()

// With grouping (custom functions)
?rpc/sales_by_category
```

</td>
</tr>
</table>

---

## ⚠️ **Error Handling**

### 🚨 **Common Error Codes**

<table>
<tr>
<td width="33%">

#### **4xx Client Errors**
```typescript
// 400 Bad Request
{
  "code": "PGRST102",
  "message": "Could not parse JSON"
}

// 401 Unauthorized
{
  "code": "PGRST301",
  "message": "JWT expired"
}

// 404 Not Found
{
  "code": "PGRST116",
  "message": "Resource not found"
}
```

</td>
<td width="33%">

#### **5xx Server Errors**
```typescript
// 500 Internal Server Error
{
  "code": "PGRST000",
  "message": "Database connection failed"
}

// 503 Service Unavailable
{
  "code": "PGRST003",
  "message": "Service temporarily unavailable"
}
```

</td>
<td width="33%">

#### **Database Errors**
```typescript
// Constraint violation
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint"
}

// Permission denied
{
  "code": "42501",
  "message": "permission denied for table"
}
```

</td>
</tr>
</table>

---

## 🔒 **Security & Authentication**

### 🛡️ **Row Level Security (RLS)**

```sql
-- Example RLS Policies
CREATE POLICY "Users can view their own profile"
  ON admin_users FOR SELECT
  USING (auth.uid() = id::text::uuid);

CREATE POLICY "Authenticated users can view products"
  ON produtos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON produtos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()::text::uuid
      AND role = 'admin'
    )
  );
```

### 🔐 **API Key Management**

- **🔑 Service Role Key**: Full database access (server-side only)
- **🌐 Anonymous Key**: Public access with RLS enforcement
- **👤 User JWT**: Authenticated user context
- **⚡ Edge Functions**: Supabase Edge Functions for complex logic

---

## 📚 **SDKs & Integration Examples**

### 🟢 **JavaScript/TypeScript**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseKey)

// Authenticated request
const { data, error } = await supabase
  .from('produtos')
  .select(`
    *,
    categorias (
      nome,
      cor
    )
  `)
  .eq('ativo', true)
  .order('nome')
  .limit(20)

// Real-time subscription
const subscription = supabase
  .channel('products')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'produtos' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

### 🐍 **Python Example**

```python
from supabase import create_client, Client

supabase: Client = create_client(supabase_url, supabase_key)

# Query products
response = supabase.table('produtos').select('*').eq('ativo', True).execute()
products = response.data

# Insert new product
new_product = {
    'nome': 'Novo Produto',
    'preco': 15.90,
    'ativo': True
}
result = supabase.table('produtos').insert(new_product).execute()
```

---

## 🚀 **Performance & Optimization**

### ⚡ **Query Optimization Tips**

<table>
<tr>
<td width="50%">

#### 🎯 **Efficient Querying**
```typescript
// ✅ Select only needed columns
?select=id,nome,preco

// ✅ Use indexes (created on frequently queried columns)
?categoria_id=eq.uuid&order=created_at.desc

// ✅ Limit results
?limit=20&offset=0

// ❌ Avoid select=*
// ❌ Avoid deep nesting
// ❌ Avoid unindexed filters
```

</td>
<td width="50%">

#### 🔄 **Caching Strategy**
```typescript
// Client-side caching
const cachedData = localStorage.getItem('products')
if (cachedData && !isExpired(cachedData)) {
  return JSON.parse(cachedData)
}

// Server-side caching (Edge Functions)
const cached = await cache.get(cacheKey)
if (cached) return cached

// Real-time updates invalidate cache
supabase.channel('products')
  .on('postgres_changes', () => {
    localStorage.removeItem('products')
  })
```

</td>
</tr>
</table>

---

## 🎉 **API Status & Monitoring**

<div align="center">

### 📊 **Current API Status**

[![Uptime](https://img.shields.io/badge/Uptime-99.9%25-success?style=for-the-badge)](#)
[![Response Time](https://img.shields.io/badge/Response_Time-<200ms-success?style=for-the-badge)](#)
[![Rate Limit](https://img.shields.io/badge/Rate_Limit-1000%2Fmin-blue?style=for-the-badge)](#)

### 🔗 **Quick Links**

[![Supabase Dashboard](https://img.shields.io/badge/Supabase-Dashboard-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/dashboard/project/cxusoclwtixtjwghjlcj)
[![API Status](https://img.shields.io/badge/API-Status_Page-blue?style=for-the-badge&logo=statuspage&logoColor=white)](https://status.supabase.com/)
[![Documentation](https://img.shields.io/badge/PostgREST-Docs-orange?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgrest.org/en/stable/)

---

*Documentação atualizada em 26/09/2025*
*GestãoZe System v1.0.0*

</div>