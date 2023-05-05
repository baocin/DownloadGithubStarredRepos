from setuptools import setup, find_packages

setup(
    name='get_starred_repos_data',
    version='1.0',
    description='Get starred repos data from Github',
    author='Michael Pedersen',
    author_email='michael@steele.red',
    packages=find_packages(),
    install_requires=[
        'requests',
        'base64',
        'json',
        'logging',
        'os',
        'time',
        'urllib3',
        'sys'
    ],
)
