import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Text } from '@fluentui/react/lib/Text';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  DetailsRow
} from '@fluentui/react/lib/DetailsList';
import './App.css';
import { FETCH_POSTS, DELETE_POST, ADD_POST } from "./constants";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const posts = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        dispatch({ type: FETCH_POSTS, payload: data });
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);


  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onBodyChange = (e) => {
    setBody(e.target.value);
  };

  const onAddPost = () => {
    if (title.trim().length === 0 || body.trim().length === 0) { alert('Please, fill in title and content!'); return; }
    const lastPostIndex = posts.length - 1;
    const newPost = {
      userId: (posts[lastPostIndex]['id'] % 10 === 0) ? (posts[lastPostIndex]['userId'] + 1) : posts[lastPostIndex]['userId'],
      id: posts[lastPostIndex]['id'] + 1,
      title,
      body
    };
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        dispatch({ type: ADD_POST, payload: newPost });
        alert('Post was added!');
        setTitle('');
        setBody('');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const onDeletePost = (postId) => {
    if (window.confirm("Delete this post?")) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE'
      })
        .then(response => { if (response.ok) { dispatch({ type: DELETE_POST, payload: { id: postId } }); } })
        .catch(error => {
          console.error('There was an error!', error);
        });
    } else { return; }
  };

  const columns = [
    { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 20, maxWidth: 20, isResizable: true },
    { key: 'column2', name: 'Title', fieldName: 'title', minWidth: 200, maxWidth: 300, isResizable: true },
    { key: 'column3', name: 'Content', fieldName: 'content', minWidth: 200, maxWidth: 800, isResizable: true },
    { key: 'column4', name: 'Delete', fieldName: 'delete', minWidth: 10, maxWidth: 50, isResizable: true }
  ];

  const _onRenderRow = props => {
    const customStyles = {};
    if (props) {
      if (props.itemIndex % 2 === 0) {
        customStyles.root = { backgroundColor: '#f5f5f5' };
      }

      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const allItems = [];

  posts.length > 0 && posts.forEach((post) =>
    allItems.push({
      id: post.id,
      title: post.title,
      content: post.body,
      delete: (<i className="ms-Icon ms-Icon--Delete btn-del" aria-hidden="true" onClick={() => onDeletePost(post.id)}></i>)
    }),
  );


  return (
    <div className="ms-Grid" dir="ltr">
      <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm12">
          <div className="wrapper">
            <Text variant='mediumPlus' block className='add'>Add post</Text>
            <TextField value={title} onChange={onTitleChange} label="Title" required placeholder="title" />
            <TextField value={body} onChange={onBodyChange} label="Content" multiline autoAdjustHeight required placeholder="content" />
            <PrimaryButton text="add post" className='add-btn' onClick={onAddPost} />
          </div>
          {isLoading && <Spinner size={SpinnerSize.medium} />}
          {!isLoading && (<div className="wrapper-table">
          	<DetailsList
            items={allItems}
            columns={columns}
            setKey="set"
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            onRenderRow={_onRenderRow}
          />
           </div>)}
        </div>
      </div>
    </div>
  );
}

export default App;
