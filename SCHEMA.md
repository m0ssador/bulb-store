# Интернет-магазин лампочек — концептуальная модель данных

Краткое описание домена:

| Область | Содержание |
|--------|------------|
| **Товары** | Ассортимент лампочек; типы/категории вынесены в справочник (сейчас ~20 позиций, список расширяемый без смены схемы). |
| **Заказы** | Корзина пользователя → оформление заказа; список заказов в личном кабинете. |
| **Доставка** | Способ: доставка или самовывоз; оплата при получении (наложенный платёж / оплата курьеру или в пункте выдачи). |
| **Авторизация** | Учётные записи покупателей; роли для доступа к панели управления. |
| **Панель управления** | Сотрудник вручную переводит заказ по статусам (workflow заказа). |

Схема данных:

```mermaid
erDiagram
    USER ||--o{ ORDER : "меняет статус"

    BULB_CATEGORY ||--o{ PRODUCT : "классифицирует"


    ORDER ||--o{ ORDER_ITEM : "содержит"
    PRODUCT ||--o{ ORDER_ITEM : "в заказе"
    
    USER {
        uuid id PK
        string login UK "логин"
        string password_hash
        string full_name
        datetime created_at
        bool is_active
    }

    BULB_CATEGORY {
        uuid id PK
        string name "тип лампы (LED, галоген и т.д.)"
        string slug UK
        text description
        int sort_order
    }

    PRODUCT {
        uuid id PK
        uuid category_id FK
        string name
        string sku UK
        decimal price
        int stock_qty
        text short_description
        text description
        bool is_published
        datetime updated_at
    }

    ORDER {
        uuid id PK
        uuid session_id "ID пользовательской сессии из браузера"
        enum status
        enum delivery_type "DELIVERY, PICKUP"
        string delivery_address "если доставка"
        decimal total_amount
        text customer_comment
        uuid status_changed_by_staff_id FK "кто последний менял статус"
        datetime status_changed_at
        datetime created_at
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price_snapshot "цена на момент заказа"
        string product_name_snapshot
    }
```

## Связи и правила (логика)

- **Типы ламп** (`BULB_CATEGORY`) — отдельная сущность: при росте ассортимента добавляются строки, а не новые таблицы.
- **Заказ** — копирует цену и наименование в `ORDER_ITEM` (снимок), чтобы история не «поехала» при смене цены карточки товара.
- **Статус заказа** меняется сотрудником из панели; поля `status_changed_by_staff_id` и `status_changed_at` фиксируют аудит.
