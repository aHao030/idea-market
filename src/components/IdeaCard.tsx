import { Bookmark, ArrowUpRight, Users, WalletCards } from 'lucide-react';
import type { Idea } from '../types/idea';
import { SparkArtwork } from './SparkArtwork';

interface IdeaCardProps {
  idea: Idea;
  favorite: boolean;
  purchased?: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
}

export function IdeaCard({ idea, favorite, purchased = false, onOpen, onToggleFavorite }: IdeaCardProps) {
  return (
    <article className="idea-card">
      <button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} onClick={onToggleFavorite} aria-label={favorite ? `取消收藏${idea.title}` : `收藏${idea.title}`}>
        <Bookmark size={19} fill={favorite ? 'currentColor' : 'none'} />
      </button>
      <button className="idea-card__open" onClick={onOpen} aria-label={`查看点子：${idea.title}`}>
        <SparkArtwork variant={idea.artVariant} />
        <div className="idea-card__body">
          <div className="idea-card__eyebrow">
            <span>{idea.category}</span>
            <span className={`evidence evidence--${idea.evidence}`}>{idea.evidence}</span>
          </div>
          <h3>{idea.title}</h3>
          <p className="idea-card__summary">{idea.summary}</p>
          <div className="idea-card__facts">
            <span><WalletCards size={15} />{idea.budget}</span>
            <span><Users size={15} />{idea.team}</span>
          </div>
          <div className="idea-card__footer">
            <div className="author-inline">
              <span className="avatar avatar--small">{idea.author.initials}</span>
              <span>{idea.author.name}</span>
              {purchased && <span className="owned-label">已解锁</span>}
            </div>
            <div className="price-inline">
              <strong><small>¥</small>{idea.price}</strong>
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}
