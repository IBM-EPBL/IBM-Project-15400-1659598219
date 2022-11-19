import requests
from config import API_KEY

def getNews(query:dict):
    query_string="q="+query.get('q')

    main_url="https://newsapi.org/v2/top-headlines?"
    final_url="{0}{1}&apiKey={2}".format(main_url,query_string,API_KEY)
    article=requests.get(final_url)
    return article.json()
