from django.urls import include, path

from users.urls import urlpatterns as user_urls
from manufacturers.urls import urlpatterns as manufacturer_urls
from medicine_types.urls import urlpatterns as medicine_types_urls
from suppliers.urls import urlpatterns as suppliers_urls
from medicine.urls import urlpatterns as medicine_urls
from invoice.urls import urlpatterns as invoice_urls
from statistics.urls import urlpatterns as statistics_urls

class APIRouter:
    urlpatterns = [
        path("user/", include(user_urls)),
        path("manufacturer/", include(manufacturer_urls)),
        path("medicine-type/", include(medicine_types_urls)),
        path("supplier/", include(suppliers_urls)),
        path("medicine/", include(medicine_urls)),
        path("invoice/", include(invoice_urls)),
        path("statistics/", include(statistics_urls)),
    ]